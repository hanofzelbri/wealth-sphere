import { BehaviorSubject, Observable } from "rxjs";
import { supabase } from "@/lib/supabaseClient";

export interface User {
  id: string;
  name: string;
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
      this.currentUserSubject.next({
        id: user.id,
        name: user.email || "User",
      });
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
    if (data.user) {
      const user: User = {
        id: data.user.id,
        name: data.user.email || "User",
      };
      this.currentUserSubject.next(user);
      return user;
    }
    return null;
  }

  async logout() {
    await supabase.auth.signOut();
    this.currentUserSubject.next(null);
  }
}

export const userService = new UserService();
