"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getProfileById } from "@/data/profiles";

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const {data:profileData,error:profileError} = await getProfileById(data.user.id);

  if (profileError) {
    return { error: profileError.message };
  }

  if (profileData?.role === "teacher") {
    redirect("/dashboard/teacher");
  } else if (profileData?.role === "student") {
    redirect("/dashboard/student");
  }

};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};
