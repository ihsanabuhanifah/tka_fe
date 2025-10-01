import { cn } from "@/lib/utils";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail } from "lucide-react";

import { jwtDecode } from "jwt-decode";
import { useLogin, type loginInterface } from "./service";

const CLIENT_ID = import.meta.env.VITE_REACT_APP_CLIENT_ID as string;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const mutate = useLogin();

  const handleSuccess = (credentialResponse: any) => {
    const decoded: any = jwtDecode(credentialResponse.credential);
    const payload: loginInterface = {
      email: decoded.email as string,
      name: decoded.name,
      foto_profile: decoded.picture,
    };
    mutate.mutate(payload);
  };

  const handleError = () => {
    console.log("Login Failed");
    alert("Login gagal! Silakan coba lagi.");
  };

  // const profile = useProfile();

  // useEffect(() => {
  //   if (profile) {
  //     navigate("/guru");
  //   }
  // }, [profile]);

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        {mutate.isPending ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="relative">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <p className="font-semibold text-gray-900 text-lg">
                Setting up your account
              </p>
              <p className="text-gray-500 max-w-sm">
                We're preparing your dashboard. This will just take a moment...
              </p>
            </div>
            <div className="w-48 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Hello</CardTitle>
              <CardDescription>Selamat Datang</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  // useOneTap
                  theme="filled_blue"
                  size="large"
                  text="signin"
                  shape="rectangular"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
