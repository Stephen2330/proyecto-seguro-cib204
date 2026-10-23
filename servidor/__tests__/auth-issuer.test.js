const crypto = require("crypto");
const http = require("http");
const express = require("express");

const expectedIssuer = "https://issuer-valido.test/realms/appmovil";
const wrongIssuer = "https://issuer-distinto.test/realms/appmovil";
const audience = "api-cifrado";
const keyId = "rs11-temporary-test-key";
const issuedAt = Math.floor(Date.now() / 1000);

let jwksServer;
let apiServer;
let apiPort;
let privateKey;
let previousEnv;

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server.address().port));
  });
}

function close(server) {
  return new Promise(resolve => {
    if (!server || !server.listening) {
      resolve();
      return;
    }

    server.close(() => resolve());
    server.closeAllConnections?.();
  });
}

function createToken(issuer) {
  const header = {
    alg: "RS256",
    typ: "JWT",
    kid: keyId
  };
  const payload = {
    iss: issuer,
    aud: audience,
    sub: "rs11-test-user",
    iat: issuedAt,
    exp: issuedAt + 300
  };
  const signingInput = [
    Buffer.from(JSON.stringify(header)).toString("base64url"),
    Buffer.from(JSON.stringify(payload)).toString("base64url")
  ].join(".");
  const signature = crypto
    .sign("RSA-SHA256", Buffer.from(signingInput), privateKey)
    .toString("base64url");

  return `${signingInput}.${signature}`;
}

async function getStatus(token) {
  const response = await fetch(`http://127.0.0.1:${apiPort}/protected`, {
    headers: {authorization: `Bearer ${token}`}
  });

  await response.arrayBuffer();
  return response.status;
}

beforeAll(async () => {
  previousEnv = {
    AUTH_ENABLED: process.env.AUTH_ENABLED,
    KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
    KEYCLOAK_JWKS_URI: process.env.KEYCLOAK_JWKS_URI,
    KEYCLOAK_AUDIENCE: process.env.KEYCLOAK_AUDIENCE
  };

  const keyPair = crypto.generateKeyPairSync("rsa", {modulusLength: 2048});
  privateKey = keyPair.privateKey;

  const publicJwk = {
    ...keyPair.publicKey.export({format: "jwk"}),
    kid: keyId,
    alg: "RS256",
    use: "sig"
  };

  jwksServer = http.createServer((request, response) => {
    if (request.url !== "/jwks") {
      response.writeHead(404).end();
      return;
    }

    response.writeHead(200, {"content-type": "application/json"});
    response.end(JSON.stringify({keys: [publicJwk]}));
  });

  const jwksPort = await listen(jwksServer);

  process.env.AUTH_ENABLED = "true";
  process.env.KEYCLOAK_ISSUER = expectedIssuer;
  process.env.KEYCLOAK_JWKS_URI = `http://127.0.0.1:${jwksPort}/jwks`;
  process.env.KEYCLOAK_AUDIENCE = audience;

  const {verificarToken} = require("../auth");
  const app = express();

  app.get("/protected", verificarToken, (request, response) => {
    response.status(200).end();
  });

  apiServer = http.createServer(app);
  apiPort = await listen(apiServer);
});

afterAll(async () => {
  await close(apiServer);
  await close(jwksServer);

  for (const [name, value] of Object.entries(previousEnv)) {
    if (value === undefined) {
      delete process.env[name];
    } else {
      process.env[name] = value;
    }
  }
});

test("acepta RS256 vigente con audiencia y emisor esperados", async () => {
  await expect(getStatus(createToken(expectedIssuer))).resolves.toBe(200);
});

test("rechaza RS256 válido cuando solo cambia el emisor", async () => {
  await expect(getStatus(createToken(wrongIssuer))).resolves.toBe(401);
});