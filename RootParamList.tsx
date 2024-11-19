export type RootStackParamList = {
    Entry: undefined;
    SignIn: undefined;
    Login: undefined;
    OTPVerification: { phone: string }; // La ruta espera el parámetro `phone`
    MainMenu: undefined;
    Maps: undefined;
    DisplayNecesidades: undefined;
    AddNecesidad: undefined;
    DonorProfile: { userId: string };
};