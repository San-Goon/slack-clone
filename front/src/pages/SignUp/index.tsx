import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Header, Input, Label, Error, LinkContainer } from './styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';

const SignUp = () => {
  const { data } = useSWR('/api/users', fetcher);
  const navigate = useNavigate();
  const [email, onChangeEmail] = useInput();
  const [nickname, onChangeNickname] = useInput();
  const [password, onChangePassword] = useInput();
  const [passwordCheck, onChangePasswordCheck] = useInput();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (nickname.length === 0) {
        setErrorMessage('닉네임을 입력해 주세요.');
      } else if (nickname.length < 2) {
        setErrorMessage('2자 이상의 닉네임만 사용 가능 합니다.');
      } else if (password.length === 0) {
        setErrorMessage('비밀번호를 입력해 주세요.');
      } else if (password.length < 8) {
        setErrorMessage('8자 이상의 비밀번호만 사용 가능 합니다.');
      } else if (password !== passwordCheck) {
        setErrorMessage('비밀번호가 일치하지 않습니다.');
      } else {
        setErrorMessage('');
        axios
          .post('/api/users', {
            email,
            nickname,
            password,
          })
          .then(() => {
            navigate('/login?signup=true');
          })
          .catch((error) => {
            if (error.response.status === 403) {
              setErrorMessage(error.response.data);
            } else {
              setErrorMessage('알수없는 에러가 발생했습니다 잠시후 다시 시도해주세요.');
            }
          });
      }
    },
    [email, nickname, password, passwordCheck],
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
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input
              type="nickname"
              id="nickname"
              name="nickname"
              placeholder="2자 이상 입력해 주세요."
              value={nickname}
              onChange={onChangeNickname}
            />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="8자 이상 입력해 주세요."
              value={password}
              onChange={onChangePassword}
            />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              placeholder="위와 같은 비밀번호를 입력해 주세요."
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {errorMessage ? <Error>{errorMessage}</Error> : null}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
