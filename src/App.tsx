import { Route, Routes } from "react-router";
import Home from "./pages/home/page";
import LoginPage from "./pages/auth/page";
import LayoutGuru from "./pages/guru/layout";
import Dashboard from "./pages/guru/dashboard/page";
import NotFoundPage from "./pages/notfound/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Assesment from "./pages/guru/assesment/page";
import UpdateAssesmentPage from "./pages/guru/assesment/update/page";


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/guru" element={<LayoutGuru />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="assesment" element={<Assesment />} />
           <Route path="assesment/:id" element={<UpdateAssesmentPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
