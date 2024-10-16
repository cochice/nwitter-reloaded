import React, { useState } from 'react';
import styled from 'styled-components'
import { auth, db, storage } from '../routes/firebase';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 250px;
    margin-bottom: 1px;
`;

const TextArea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    border-radius: 20px;
    font-size: 16px;
    color: white;
    background-color: black;
    width: 100%;
    resize: none;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    &::placeholder {
        font-size: 16px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;        
    }
    &:focus {
        outline: none;
        border-color: #1d9bf0;
    }
`;

const AttachFileButton = styled.label`
    padding: 10px 0px;
    color: #1d9bf0;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #1d9bf0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
`;

const AttachFileInput = styled.input`
    display: none;
`;

const SubmitBtn = styled.input`
    background-color: #1d9bf0;
    color: white;
    border: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    &:hover, &:active {
        opacity: 0.9;
    }
`;

export default function PostTweetForm() {
    const [isLoding, setLoding] = useState(false);
    const [tweet, setTweet] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    };
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length === 1) {
            const mb = 1024 * 1024;//1mb
            const limitSize = mb * 2;

            console.log(`limitSize:[${limitSize}], fileSize:[${files[0].size}]`);

            if (files[0].size > limitSize) {
                alert(`2mb 사이즈 미만의 이미지만 업로드 가능합니다.`);
                setFile(null);
                return;
            }

            setFile(files[0]);
        }
    };
    const onSumit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user || isLoding || tweet === "" || tweet.length > 180) return;

        try {
            setLoding(true);
            const doc = await addDoc(collection(db, "tweets"), {
                tweet,
                createdAt: Date.now(),
                username: user.displayName || "Anonymous",
                userId: user.uid,
            });

            if (file) {
                const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
                const result = await uploadBytes(locationRef, file);
                const url = await getDownloadURL(result.ref);
                await updateDoc(doc, {
                    photo: url,
                });
            }
            setTweet("");
            setFile(null);
        } catch (e) {
            console.log(e);
        } finally {
            setLoding(false);
        }
    };
    return (
        <Form onSubmit={onSumit}>
            <TextArea
                required
                rows={5}
                maxLength={180}
                onChange={onChange}
                value={tweet}
                placeholder='What is happening?' />
            <AttachFileButton htmlFor='file'>{file ? "Photo added ✅" : "Add photo"}</AttachFileButton>
            <AttachFileInput onChange={onFileChange} type='file' id="file" accept='image/*' />
            <SubmitBtn type='submit' value={isLoding ? 'Posting...' : 'Post Tweet'} />
        </Form>
    )
}