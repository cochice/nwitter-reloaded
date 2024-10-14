import React, { useState } from 'react';
import { auth, db, storage } from '../routes/firebase';
import { ITweet } from './timeline';
import styled from 'styled-components';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import ReactModal from 'react-modal';

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 15px;
`;

const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
`;

const Payload = styled.p`
    margin: 10px 0px;
    font-size: 18px;
`;

const DeleteButton = styled.button`
    background-color: tomato;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 5px;
    width: 70px;
`;

const EditeButton = styled.button`
    background-color  : skyblue;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 5px;
    width: 70px;
`;

const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 5px;
    
`;

// const CloseButton = styled.button`
//     cursor: pointer;
//     border-radius: 5px;
//     font-size: 16px;
//     font-weight: 600;
//     width: 30px;
//     align-items: center;
// `;

const EditWrapper = styled.div`
    display: grid;
    grid-template-columns: auto;
    flex-direction: column;
    gap: 10px;
`;

/*overlay는 모달 창 바깥 부분을 처리하는 부분이고,
content는 모달 창부분이라고 생각하면 쉬울 것이다*/
const customModalStyles: ReactModal.Styles = {
    overlay: {
        backgroundColor: " rgba(255, 255, 255, 0.6)",
        width: "100%",
        height: "100vh",
        zIndex: "10",
        position: "fixed",
        top: "0",
        left: "0",
    },
    content: {
        width: "600px",
        height: "350px",
        zIndex: "150",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "10px",
        boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
        backgroundColor: 'black',
        justifyContent: "center",
        overflow: "auto",
        border: '0',
    },
};

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const TextArea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    border-radius: 20px;
    font-size: 16px;
    color: white;
    background-color: black;
    width: 100;
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

const CloseBtn = styled.button`
    background-color: black;
    padding: 10px 0px;
    color: #ffffff;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #ffffff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    &:hover, &:active {
        opacity: 0.8;
    }    
`;

const DeleteBtn = styled.button`
    background-color: #d42121;
    color: #ffffff;
    border: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    &:hover, &:active {
        opacity: 0.9;
    }
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoding, setLoding] = useState(false);
    const [l_tweet, setTweet] = useState(tweet);
    const user = auth.currentUser;
    const onDelete = async () => {
        const ok = confirm("Are you sure you want to delete this tweet?");
        if (!ok) return;
        if (user?.uid !== userId) return;
        try {
            await deleteDoc(doc(db, "tweets", id));
            if (photo) {
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);
            }
        } catch (e) {
            console.log(e);
        } finally {
            ;
        }
    };
    const openModal = async () => {
        setModalOpen(true);
    };
    const [file, setFile] = useState<File | null>(null);
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    };
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length === 1) {
            const mb = 1024 * 1024;//1mb
            const limitSize = mb * 2;
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
        if (!user || user.displayName !== username || isLoding || l_tweet === "" || l_tweet.length > 180) return;

        try {
            setLoding(true);
            const docRef = doc(db, "tweets", id);
            await updateDoc(docRef, {
                username,
                userId,
                tweet: l_tweet
            });

            if (file) {
                const locationRef = ref(storage, `tweets/${userId}/${id}`);
                const result = await uploadBytes(locationRef, file);
                const url = await getDownloadURL(result.ref);
                await updateDoc(docRef, {
                    photo: url,
                });
            }
            //setTweet("");
            setFile(null);
            setModalOpen(false);
        } catch (e) {
            console.log(e);
        } finally {
            setLoding(false);
        }
    };
    const onFileDelete = async () => {
        const ok = confirm("Are you sure you want to delete this file?");
        if (!ok) return;
        if (user?.uid !== userId) return;
        try {
            if (photo) {
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);
                const docRef = doc(db, "tweets", id);
                await updateDoc(docRef, { photo: '' });
            }
        } catch (e) {
            console.log(e);
        } finally {
            ;
        }

    };
    return <Wrapper>
        <Column>
            <Username>{username}</Username>
            <Payload>{tweet}</Payload>
            {user?.uid === userId ?
                <Buttons>
                    <DeleteButton onClick={onDelete}>Delete</DeleteButton>
                    <EditeButton onClick={openModal}>Edit</EditeButton>
                </Buttons>
                : null}
            <ReactModal
                isOpen={modalOpen}
                style={customModalStyles} ariaHideApp={false}>
                <EditWrapper>
                    <Form onSubmit={onSumit}>
                        <TextArea
                            required
                            rows={5}
                            maxLength={180}
                            onChange={onChange}
                            value={l_tweet}
                            placeholder='What is happening?' />
                        {photo ? <DeleteBtn onClick={onFileDelete}>Delete photo</DeleteBtn> : <AttachFileButton htmlFor='file1'>{file ? "Photo added ✅" : "Add photo"}</AttachFileButton>}
                        <AttachFileInput onChange={onFileChange} type='file' id='file1' accept='image/*' />
                        <SubmitBtn type='submit' value={isLoding ? 'Editing...' : 'Post Tweet'} />
                        <CloseBtn onClick={() => setModalOpen(false)}>Cancel</CloseBtn>
                    </Form>
                </EditWrapper>
            </ReactModal>
        </Column>
        {photo ? (<Column><Photo src={photo} /></Column>) : null}
    </Wrapper>
}