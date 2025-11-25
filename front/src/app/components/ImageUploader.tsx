"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageUploader({
    onFileSelected,
}: {
    onFileSelected: (file: File | null) => void;
}) {
    const [preview, setPreview] = useState<string | null>(null);

    const handleSelect = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelected(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="w-full">
            {preview ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                    <Image src={preview} alt="preview" fill className="object-cover" />
                </div>
            ) : (
                <label className="w-full h-40 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition">
                    <span className="text-gray-500">Haz clic para subir una imagen</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleSelect} />
                </label>
            )}
        </div>
    );
}
