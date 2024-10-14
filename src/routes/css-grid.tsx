import styled from 'styled-components'

const Wrapper = styled.div`
    display: grid;
    padding: 10px;
    grid-template-columns: repeat(5, 1fr);
    grid-auto-rows: minmax(150px, auto);
    grid-gap: 10px;
`;

const Item = styled.div`
    width: 10vw;
    height: 3vh;

    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid white;
    font-size: 1.2rem;
    font-weight: bold;

    &.item2 {
        grid-column-start: 2;
        grid-column-end: 4;
        border: 1px solid white;
    }

    &.color1 {
        background-color: #d7bee2;
    }
    &.color2 {
        background-color: #a9c7d8;
    }
    &.color3 {
        background-color: #c0df9f;
    }
    &.color4 {
        background-color: #f2e5a6;
    }
    &.color5 {
        background-color: #e89d9d;
    }
`;

export default function CssGrid() {
    return (
        <Wrapper>
            <Item className='item1 color1'>Item1</Item>
            <Item className='item2 color2'>Item2</Item>
            <Item className='item3 color3'>Item3</Item>
            <Item className='item4 color4'>Item4</Item>
            <Item className='item5 color5'>Item5</Item>
            <Item className='item6 color1'>Item6</Item>
            <Item className='item7 color2'>Item7</Item>
            <Item className='item8 color3'>Item8</Item>
            <Item className='item9 color4'>Item9</Item>
            <Item className='item10 color5'>Item10</Item>
        </Wrapper>
    )
}