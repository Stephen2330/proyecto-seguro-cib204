// App.js — Aplicacion movil (cliente) que consume el servicio de cifrado.
// Es una app Expo / React Native. Se puede ejecutar en el navegador (Expo Web)
// o en un telefono con Expo Go. Un solo pantalla: cifrar y descifrar texto.
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function App() {
  const [base, setBase] = useState('http://localhost:3000');
  const [token, setToken] = useState('');
  const [texto, setTexto] = useState('Hola mundo seguro CIB-204');
  const [cifrado, setCifrado] = useState('');
  const [descifrado, setDescifrado] = useState('');
  const [estado, setEstado] = useState('');

  const cabeceras = () => {
    const h = { 'Content-Type': 'application/json' };
    if (token) h['Authorization'] = 'Bearer ' + token; // solo si el servicio exige token
    return h;
  };

  const cifrar = async () => {
    setEstado('Cifrando...');
    try {
      const r = await fetch(base + '/cifrar', { method: 'POST', headers: cabeceras(), body: JSON.stringify({ texto }) });
      const j = await r.json();
      if (!r.ok) { setEstado('Error ' + r.status + ': ' + (j.error || '')); return; }
      setCifrado(j.cifrado || ''); setEstado('Cifrado OK');
    } catch (e) { setEstado('Error de red: ' + e.message); }
  };

  const descifrar = async () => {
    setEstado('Descifrando...');
    try {
      const r = await fetch(base + '/descifrar', { method: 'POST', headers: cabeceras(), body: JSON.stringify({ cifrado }) });
      const j = await r.json();
      if (!r.ok) { setEstado('Error ' + r.status + ': ' + (j.error || '')); return; }
      setDescifrado(j.texto || ''); setEstado('Descifrado OK');
    } catch (e) { setEstado('Error de red: ' + e.message); }
  };

  return (
    <SafeAreaView style={s.c}>
      <ScrollView contentContainerStyle={s.p}>
        <Text style={s.h}>Cliente movil - Cifrado CIB-204</Text>
        <Text style={s.l}>URL del servicio</Text>
        <TextInput style={s.i} value={base} onChangeText={setBase} autoCapitalize="none" />
        <Text style={s.l}>Token (opcional, si el servicio exige autenticacion)</Text>
        <TextInput style={s.i} value={token} onChangeText={setToken} autoCapitalize="none" placeholder="pega aqui el token" />
        <Text style={s.l}>Texto a cifrar</Text>
        <TextInput style={s.i} value={texto} onChangeText={setTexto} />
        <Text> </Text>
        <Button title="Cifrar" onPress={cifrar} color="#00469B" />
        <Text style={s.l}>Cifrado (resultado)</Text>
        <TextInput style={[s.i, s.area]} value={cifrado} onChangeText={setCifrado} multiline />
        <Button title="Descifrar" onPress={descifrar} color="#00469B" />
        <Text style={s.l}>Descifrado (resultado)</Text>
        <Text style={s.out}>{descifrado}</Text>
        <Text style={s.estado}>{estado}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#fff' },
  p: { padding: 20 },
  h: { fontSize: 20, fontWeight: 'bold', color: '#00469B', marginBottom: 16 },
  l: { marginTop: 12, marginBottom: 4, fontWeight: '600' },
  i: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  area: { minHeight: 80 },
  out: { padding: 10, backgroundColor: '#E2EFDA', borderRadius: 8, minHeight: 40 },
  estado: { marginTop: 16, color: '#555' },
});
