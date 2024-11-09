# Proyecto Aplicación Móvil con Expo y Firebase

Este proyecto contiene un script para instalar las dependencias desde el archivo `requirements.txt` y ajustar el path si es necesario para la configuración en tu sistema.

## Instrucciones de instalación

### 1. Instala el archivo requirements 
Al correr este comando, se instalarán las siguientes dependencias en tu entorno:

- `@react-native-async-storage/async-storage` (1.23.1)
- `@react-native-community/masked-view` (0.1.11)
- `@react-navigation/native` (6.1.18)
- `@react-navigation/stack` (6.4.1)
- `expo` (51.0.28)
- `expo-status-bar` (1.12.1)
- `firebase` (10.14.1)
- `react` (18.2.0)
- `react-native` (0.74.5)
- `react-native-gesture-handler` (2.16.1)
- `react-native-reanimated` (3.10.1)
- `react-native-safe-area-context` (4.10.5)
- `react-native-screens` (3.31.1)
- `react-native-maps` (1.14.0)

#### Dependencias de desarrollo

- `@babel/core` (7.20.0)
- `@types/react` (18.2.45)
- `@types/react-native` (0.73.0)
- `@types/react-native-maps` (0.24.2)
- `typescript` (5.1.3)

Para instalar todas las dependencias, ejecuta el siguiente comando:

Instalar dependencias en UNIX (Linux/macOS)
```bash
npm install $(cat requirements.txt)

```
Instalar dependencias en Windows
```bash
npm install $(Get-Content requirements.txt)
```