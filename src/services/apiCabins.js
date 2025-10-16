import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
    const { data, error } = await supabase.from("cabins").select("*");
    if (error) {
        console.error(error);
        throw new Error("Cabins could not be loaded");
    }
    return data;
}

export async function deleteCabin(id) {
    const { data, error } = await supabase.from("cabins").delete().eq("id", id);
    if (error) {
        console.error(error);
        throw new Error("Cabin could not be deleted");
    }
    return data;
}

export async function createEditCabin(newCabin, id) {
    const hasImagePath = Boolean(newCabin.image?.startsWith?.(supabaseUrl)); // In case image is a URL string
    console.log(newCabin, id, hasImagePath);

    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
        "/",
        ""
    );
    const imagePath = hasImagePath
        ? newCabin.image
        : `${supabaseUrl}/storage/v1/object/public/cabin-images//${imageName}`;

    console.log("-->", imageName, imagePath);

    // 1. Create & Edit cabin

    // A) Common query part to both create & edit cabin
    let query = supabase.from("cabins");

    // B) Query specific to create cabin
    if (!id) {
        query = query.insert([{ ...newCabin, image: imagePath }]);
    }

    // C) Query specific to update cabin
    if (id) {
        query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
    }
    const { data, error } = await query.select();

    if (error) {
        console.error(error);
        throw new Error("Cabin could not be created or updated");
    }

    // 2. Upload image (only if it has no image path ie it has not been uploaded before)
    if (hasImagePath) return data;
    
    const { error: storageError } = await supabase.storage
        .from("cabin-images")
        .upload(imageName, newCabin.image);

    // 3. Delete the cabin IF there was an error uploading image
    if (storageError) {
        await supabase.from("cabins").delete().eq("id", data.id); // "data" from supabase LINE: 49 already contains id
        console.error(storageError);
        throw new Error(
            "Cabin image could not be uploaded and the cabin was not created"
        );
    }
    return data;
}
