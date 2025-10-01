export interface Profile {
  id: number;
  foto_profile: string;
  name: string;
  email: string;
  role: string;
}

export interface ProfileResponse {
  status: string;
  msg: string;
  data: Profile;
}
