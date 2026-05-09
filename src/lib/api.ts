
import { createClient } from "@/utils/connect";
import { sl } from "zod/locales";

const client = createClient();

export const GetProperties = {
    getProperties: async () => {
        const { data, error } = await client.from("perumahan").select("*, tipe_rumah(*)");
        if (error) {
            console.error("Error fetching perumahan:", error);
            return [];
        }
        return data;
    },
};

export const GetTipes = {
    getTipes: async () => {
        const { data, error } = await client.from("tipe_rumah").select("*");
        if (error) {
            console.error("Error fetching tipes:", error);
            return [];
        }
        return data;
    },
};

export const createProperty = async (propertyData: any) => {
    try{
        const payload = {
            name: propertyData.name,
            kota: propertyData.kota,
            lokasi: propertyData.lokasi,
            deskripsi: propertyData.deskripsi,
            slug: propertyData.name.toLowerCase().replace(/\s+/g, '-'),
        }
        const { data, error } = await client.from("perumahan").insert(payload);
        if (error) {
            console.error("Error creating property:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error creating property:", error);
        return null;
    }
};