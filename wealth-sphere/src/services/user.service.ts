import { BehaviorSubject, Observable } from "rxjs";
import { supabase } from "@/lib/supabaseClient";
import { User as SupabaseUser } from "@supabase/supabase-js";

export interface User {
  id: string;
  name: string;
  accessToken: string;
}

export class UserService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.initializeUser();
  }

  private async initializeUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;
      if (accessToken) {
        this.setCurrentUser(user, accessToken);
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.user && data.session) {
      this.setCurrentUser(data.user, data.session.access_token);
      // await supabase.auth.startAutoRefresh();
      return this.currentUserValue;
    }
    return null;
  }

  async logout() {
    await supabase.auth.signOut();
    await supabase.auth.stopAutoRefresh();
    localStorage.removeItem("token");
    this.currentUserSubject.next(null);
  }

  private setCurrentUser(user: SupabaseUser, accessToken: string) {
    const currentUser: User = {
      id: user.id,
      name: user.email || "User",
      accessToken: accessToken,
    };
    localStorage.setItem("token", accessToken);
    this.currentUserSubject.next(currentUser);
  }
}

export const userService = new UserService();
