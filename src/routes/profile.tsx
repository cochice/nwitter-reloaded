import styled from 'styled-components';
import { auth, db, storage } from '../routes/firebase';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getAuth, updateProfile } from 'firebase/auth';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { ITweet } from '../components/timeline';
import Tweet from '../components/tweet';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
`;
const AvatarUpload = styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    background-color: #1d96f0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        width: 50px;
    }
`;
const AvatarImg = styled.img`
    width: 100%;
`;
const AvatarInput = styled.input`
    display: none;
`;
const Name = styled.span`
    font-size: 22px;
    cursor: pointer;
`;

const Tweets = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 10px;
`;

const EditName = styled.input`
    width: 180px;
    border: 2px solid white;
    border-radius: 5px;
    font-size: 18px;
`;

const EditWarapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 5px;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

const SaveBtn = styled.button`
    background-color: #1d96f0;
    color: white;
    font-size: 10px;
    //border-radius: 10%;
    border: 0;
    height: 20px;
    border: 0;
    padding: 5px 10px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 5px;
`;

export default function Profile() {
    const [showInput, setShowInput] = useState(false);
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const user = auth.currentUser;
    const userName = user?.displayName ? user.displayName : 'Anonymous';
    const [displayname, setDisplayname] = useState(userName);
    const [avatar, setAvatar] = useState(user?.photoURL);
    const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (!user) return;
        if (files && files.length === 1) {
            const file = files[0];
            const locationRef = ref(storage, `avatars/${user.uid}`);
            const result = await uploadBytes(locationRef, file);
            const avatarUrl = await getDownloadURL(result.ref);
            setAvatar(avatarUrl);
            console.log(avatarUrl);
            await updateProfile(user, {
                photoURL: avatarUrl,
            });
        }
    };
    const fetchTweets = async () => {
        const tweetsQuery = query(
            collection(db, "tweets"),
            where("userId", "==", user?.uid),
            orderBy("createdAt", "desc"),
            limit(25)
        );

        const snapshot = await getDocs(tweetsQuery);
        const tweets = snapshot.docs.map((x) => {
            const { tweet, createdAt, userId, username, photo } = x.data();
            return {
                tweet,
                createdAt,
                userId,
                username,
                photo,
                id: x.id,
            };
        });
        setTweets(tweets);
    };

    useEffect(() => {
        fetchTweets();

    }, []);

    const switchSpan = () => {
        setShowInput(true);
    };

    const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const userDisNm = e.target.value;
        setDisplayname(userDisNm);
    };

    const onSave = () => {
        const authNow = getAuth();
        if (authNow !== null)
            updateProfile(authNow.currentUser!, {
                displayName: displayname,
            }).then(() => {
                console.log('Profile updated!');
            }).catch((error) => {
                console.log(error);
            });

        setShowInput(false);
    };

    return (
        <Wrapper>
            <AvatarUpload htmlFor='avatar'>
                {
                    avatar ?
                        <AvatarImg src={avatar} /> :
                        <svg
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                        </svg>
                }
            </AvatarUpload>
            <AvatarInput onChange={onAvatarChange} type='file' id='avatar' accept='image/*' />
            {showInput ?
                <EditWarapper><EditName type='text' onBlur={() => setShowInput(false)} onChange={onChangeName} value={displayname} /><SaveBtn onClick={onSave}>SAVE</SaveBtn></EditWarapper> :
                <Name onClick={switchSpan}>
                    {displayname}
                </Name>
            }
            <Tweets>
                {tweets.map((tweet) => <Tweet key={tweet.id} {...tweet} />)}
            </Tweets>
        </Wrapper>
    )
}