import React, { useCallback, useEffect, useState } from 'react';
import useInput from '@hooks/useInput';
import { Button, Form, Header, Input, Label, Error, LinkContainer } from '@pages/SignUp/styles';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const Login = () => {
  const { data, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [email, onChangeEmail] = useInput();
  const [password, onChangePassword] = useInput();

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrorMessage('');
      axios
        .post('http://localhost:3095/api/users/login', { email, password }, { withCredentials: true })
        .then((response) => {
          mutate(response.data);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            setErrorMessage(error.response.data);
          } else {
            setErrorMessage('알수없는 에러가 발생했습니다 잠시후 다시 시도해주세요.');
          }
        });
    },
    [email, password],
  );

  useEffect(() => {
    if (data) {
      navigate('/workspace/channel');
    }
  }, [data, navigate]);

  return (
    <div id="container">
      <Header>Slack</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="example@example.com"
              value={email}
              onChange={onChangeEmail}
            />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {errorMessage ? <Error>{errorMessage}</Error> : null}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default Login;
