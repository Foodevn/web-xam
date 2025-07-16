'use client';

import {useEffect, useState} from 'react';

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [files, setFiles] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');

    // Lấy danh sách file khi component mount
    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        const res = await fetch('/api/files');
        const data = await res.json();
        setFiles(data.files);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setMessage('Vui lòng chọn một file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        setMessage(data.message);
        if (res.ok) {
            setFile(null);
            fetchFiles();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 text-black">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center ">Upload & Download File</h1>

                {/* Form upload */}
                <form onSubmit={handleUpload} className="mb-6">
                    <div className="mb-4">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Upload
                    </button>
                </form>

                {message && <p className="text-center text-red-500 mb-4">{message}</p>}

                {/* Danh sách file */}
                <h2 className="text-xl font-semibold mb-2">Danh sách file</h2>
                {files.length > 0 ? (
                    <ul className="space-y-2">
                        {files.map((fileName) => (
                            <li key={fileName} className="flex justify-between items-center">
                                <span>{fileName}</span>
                                <a
                                    href={`/uploads/${fileName}`}
                                    download
                                    className="text-blue-500 hover:underline"
                                >
                                    Tải xuống
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500">Chưa có file nào</p>
                )}
            </div>
        </div>
    );
}