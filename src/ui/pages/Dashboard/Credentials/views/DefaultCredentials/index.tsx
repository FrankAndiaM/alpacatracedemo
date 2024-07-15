import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import routes from '~routes/routes';
import { getCredentialSchema } from '~services/digital_identity/credential/credential';
import { showMessage } from '~utils/Messages';
import DefaultCredentialHeader from '../../components/DefaultCredentialHeader';
import { CredentialSchemaModel } from '~models/digital_identity/credential';
import IssuanceTab from './Tabs/IssuanceTab';
import MassiveIssuanceTab from './Tabs/MassiveIssuanceTab';

type DefaultCredentialsPageProps = unknown;

const DefaultCredentialsPage: React.FC<DefaultCredentialsPageProps> = () => {
  const history = useNavigate();
  const isCompMounted = useRef(null);
  const [tab, setTab] = useState<'issuance' | 'massive_issuance'>('issuance');
  const [isCredentialLoading, setIsCredentialLoading] = useState<boolean>(true);
  const [credentialSchema, setCredentialSchema] = useState<CredentialSchemaModel | undefined>(undefined);

  // eslint-disable-next-line
  // @ts-ignore
  const { credential_id } = useParams();
  if (!credential_id) history(routes.credential);

  const credentialId: string = credential_id !== undefined ? credential_id : '';

  const _getCredentialSchema = useCallback(() => {
    getCredentialSchema(credentialId)
      .then((res: any) => {
        if (!isCompMounted.current) return;
        const data = res.data.data;
        setCredentialSchema(data);
        setIsCredentialLoading(false);
      })
      .catch(() => {
        if (!isCompMounted.current) return;
        showMessage('', 'Problemas al cargar el certificado', 'error');
      });
  }, [credentialId]);

  useEffect(() => {
    _getCredentialSchema();
  }, [_getCredentialSchema]);

  return (
    <Box ref={isCompMounted}>
      <DefaultCredentialHeader
        credentialSchema={credentialSchema}
        isLoading={isCredentialLoading}
        activeTab={tab}
        onChangeTab={setTab}
      />
      {tab === 'issuance' && <IssuanceTab credentialSchema={credentialSchema} credentialId={credentialId} />}
      {tab === 'massive_issuance' && (
        <MassiveIssuanceTab credentialSchema={credentialSchema} credentialId={credentialId} />
      )}
    </Box>
  );
};

export default DefaultCredentialsPage;
