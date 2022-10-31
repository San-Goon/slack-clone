import React, { useCallback, useState } from 'react';
import { Button, Form, Header, Input, Label, Error, LinkContainer } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';

const SignUp = () => {
  const [email, onChangeEmail] = useInput();
  const [nickname, onChangeNickname] = useInput();
  const [password, onChangePassword] = useInput();
  const [passwordCheck, onChangePasswordCheck] = useInput();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (email.length === 0) {
        setErrorMessage('이메일을 입력해 주세요.');
      } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
        setErrorMessage('올바른 이메일 형식을 입력해 주세요');
      } else if (nickname.length === 0) {
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
        console.log('submit!', email, nickname, password, passwordCheck);
      }
    },
    [email, nickname, password, passwordCheck],
  );

  return (
    <div id="container">
      <Header>Slack</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="nickname" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
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
        <a href="/login">로그인 하러가기</a>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
