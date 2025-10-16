import supabase, { supabaseUrl } from "./supabase";

export async function signup({ fullName, email, password }) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { fullName, avatar: "" } },
    });
    if (error) {
        console.error(error);
        throw new Error(error.message);
    }
    console.log(data);
    return data;
}

export async function login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        console.error(error);
        throw new Error(error.message);
    }
    return data;
    // After loggin in, supabase saves the current {user object & session object => JWT token} in Browser Local Storage
}

export async function getCurrentUser() {
    // 1. We need to check if there is an active session, it will get data from Browser Local Storage
    const { data: session, error: errorSession } =
        await supabase.auth.getSession();
    if (errorSession) {
        console.error(errorSession);
        throw new Error(error.message);
    }
    if (!session.session) return null; // It means there is no current user, and no point in getting further
    // Without a valid session, the user is not authenticated, and hence there is no user to retrieve.

    // 2. Get the JSON object for the logged in authenticated user.
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        console.error(error);
        throw new Error(error.message);
    }
    return data?.user;
}

export async function logout() {
    const { error } = await supabase.auth.signOut(); // It doesn't return any data
    // This function only removes the current {user object & session object => JWT token} from browser storage
    // but not from react query
    if (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

export async function updateCurrentUser({ fullName, password, avatar }) {
    // 1. Update password or fullname but not both simulataneously
    console.log(fullName, password, avatar);
    let updateData;
    if (password) updateData = { password };
    else if (fullName) updateData = { data: { fullName } };

    const { data, error } = await supabase.auth.updateUser(updateData);
    if (error) {
        console.error(error);
        throw new Error(error.message);
    }
    if (!avatar) return data;

    // 2. Upload the avatar image
    const fileName = `avatar-${data.user.id}-${Math.random()}`;
    const { error: storageError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatar);
    if (storageError) {
        console.error(storageError);
        throw new Error(storageError.message);
    }

    // 3. Update the avatar in the user itself with uploaded avatar URL
    const { data: updatedUser, error: error2 } = await supabase.auth.updateUser(
        {
            data: {
                avatar: `${supabaseUrl}/storage/v1/object/public/avatars//${fileName}`,
            },
        }
    );
    if (error2) {
        console.error(error2);
        throw new Error(error2.message);
    }
    return updatedUser;
}
