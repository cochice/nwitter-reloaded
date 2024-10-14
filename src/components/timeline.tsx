import {
    collection,
    // getDocs, 
    limit, onSnapshot, orderBy, query
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../routes/firebase';
import Tweet from './tweet';
import { Unsubscribe } from 'firebase/auth';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    /* overflow-y: auto; */
`;

export interface ITweet {
    id: string;
    photo?: string;
    tweet: string;
    userId: string;
    username: string;
    createdAt: number;
}

export default function TimeLine() {
    const [tweets, setTweets] = useState<ITweet[]>([]);
    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;
        const feachTweets = async () => {
            const tweetsQuery = query(
                collection(db, "tweets"),
                orderBy("createdAt", "desc"),
                limit(25)
            );

            // const spanshot = await getDocs(tweetsQuery);
            // const tweets = spanshot.docs.map((x) => {
            //     const { tweet, createdAt, userId, username, photo } = x.data();
            //     return { tweet, createdAt, userId, username, photo, id: x.id, }
            // });

            unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
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
            });
        };
        feachTweets();
        return () => {
            unsubscribe && unsubscribe();
        };
    }, []);

    return (
        <Wrapper>
            {tweets.map((tweet) => <Tweet key={tweet.id} {...tweet} />)}
        </Wrapper>
    );
}