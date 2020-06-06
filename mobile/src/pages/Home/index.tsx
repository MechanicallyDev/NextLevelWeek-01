import React, { useState, useEffect, ChangeEvent } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View, Image, ImageBackground, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import RNPickerSelect from 'react-native-picker-select';

interface IBGEUfResponse {
  nome: string;
  sigla: string;
}
interface IBGECityResponse {
  nome: string;
}
interface UFS {
  nome: string;
  sigla: string;
}

const home = () => {
  const [ufs, setUfs] = useState<UFS[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUF, setSelectedUF] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate('Points', { uf:selectedUF, city:selectedCity })
  }
  function handleSelectUF(event:string) {
    const uf = event;
    setSelectedUF(uf);
  }
  function handleSelectCity(event:string) {
    const city = event;
    setSelectedCity(city);
  }
  useEffect(() => {
    axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
      const ufInitials = response.data.map(uf => {return {nome: uf.nome, sigla: uf.sigla}})
      setUfs(ufInitials);
    })
  }, [])

  useEffect(() => {
    if (selectedUF === '0') { return; }
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios?orderBy=nome`).then(response => {
      const cityNames = response.data.map(city => city.nome)
      setCities(cityNames);
    })
  }, ([selectedUF]))

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={require('../../assets/home-background.png')}
        imageStyle={{ width: 274, height: 368 }}
        style={styles.container}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            placeholder={{label: "Escolha o Estado",value: null,color: 'green',}}
            onValueChange={e=>handleSelectUF(e)}
            value={selectedUF}
            items={ufs.map(uf => (
              {
                 label: uf.nome,
                 value: uf.sigla
              }))}
          />
          <RNPickerSelect
            placeholder={{label: "Escolha a Cidade",value: null,color: 'green',}}
            onValueChange={e=>handleSelectCity(e)}
            value={selectedCity}
            items={cities.map(city => (
              {
                 label: city,
                 value: city
              }))}
          />
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default home;