import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../routes/firebase'
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { Error, Form, Input, Switcher, Title, Wrapper } from '../components/auth-components';
import GithubButton from '../components/github-btn';

export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoding, setLoding] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        if (name === "name") {
            setName(value);
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoding || name === "" || email === "" || password === "") return;
        try {
            setLoding(true);
            // create an account
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            // set the name of the user.
            console.log(credentials.user);
            await updateProfile(credentials.user, { displayName: name, })
            // redirect to the home page.
            navigate("/");
        } catch (e) {
            if (e instanceof FirebaseError) {
                //console.log(e.code, e.message);
                setError(e.message);
            }
        } finally {
            setLoding(false);
        }

        //console.log(name, email, password);
    }

    return (
        <Wrapper>
            <Title>Join 𝕏</Title>
            <Form onSubmit={onSubmit}>
                <Input onChange={onChange} name="name" placeholder="Name" type="text" required />
                <Input onChange={onChange} name="email" placeholder="Email" type="email" required />
                <Input onChange={onChange} name="password" placeholder="Password" type="password" required />
                <Input onChange={onChange} type="submit" value={isLoding ? "Loding..." : "Create Account"} />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                Already have an account? <Link to="/login">Log in &rarr;</Link>
            </Switcher>
            <GithubButton />
        </Wrapper>
    )
}