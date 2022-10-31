import React, { useCallback, useState } from 'react';
import useInput from '@hooks/useInput';
import { Button, Form, Header, Input, Label, Error, LinkContainer } from '@pages/SignUp/styles';
import { Link } from 'react-router-dom';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [email, onChangeEmail] = useInput();
  const [password, onChangePassword] = useInput();

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log('submit!', email, password);
    },
    [email, password],
  );
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
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="8자 이상 입력해 주세요."
              value={password}
              onChange={onChangePassword}
            />
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
