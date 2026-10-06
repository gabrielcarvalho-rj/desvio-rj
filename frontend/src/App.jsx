import AppRoutes from "./routes/AppRoutes";

// A moldura visual (Navbar, conteúdo e Footer) agora vive em components/Layout.jsx,
// declarada como rota de layout dentro de AppRoutes.
function App() {
    return <AppRoutes />;
}

export default App;
