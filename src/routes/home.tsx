import styled from 'styled-components';
import PostTweetForm from '../components/post-tweet-form';
import TimeLine from '../components/timeline';

const Wrapper = styled.div`
    display: grid;
    gap: 0px;
    //overflow-y: auto;
    grid-template-rows: 1fr 5fr;
`;

export default function Home() {
    return (
        <Wrapper>
            <PostTweetForm />
            <TimeLine />
        </Wrapper>
    )
}