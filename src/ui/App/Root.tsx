// eslint-disable-next-line
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { verifyToken } from '~redux-store/actions/authActions';
import { useAppDispatch } from '~redux-store/store';

type RootProps = {
  children?: React.ReactNode;
};

const Root: React.FC<RootProps> = (props: any): any => {
  const { auth }: any = useSelector((state: any) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(verifyToken());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!auth.authReady) {
    return (
      <div className="load">
        <div className="loader"></div>
      </div>
    );
  }
  return props.children;
};

export default React.memo(Root);
