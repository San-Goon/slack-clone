import React, { useCallback, useEffect, useState } from 'react';
import useInput from '@hooks/useInput';
import { Button, Form, Header, Input, Label, Error, LinkContainer } from '../SignUp/styles';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useSWRConfig } from 'swr';

const Login = () => {
  const { data } = useSWR('/api/users', fetcher);
  const { mutate } = useSWRConfig();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [email, onChangeEmail] = useInput();
  const [password, onChangePassword] = useInput();

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrorMessage('');
      axios
        .post(`/api/users/login`, { email, password }, { withCredentials: true })
        .then((response) => {
          mutate('/api/users');
        })
        .catch((error) => {
          if (error.response.status === 401) {
            setErrorMessage('로그인 정보를 확인해주세요.');
          } else {
            setErrorMessage('알수없는 에러가 발생했습니다 잠시후 다시 시도해주세요.');
          }
        });
    },
    [email, password],
  );

  useEffect(() => {
    if (data) {
      navigate('/workspace/slack/channel/일반');
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
