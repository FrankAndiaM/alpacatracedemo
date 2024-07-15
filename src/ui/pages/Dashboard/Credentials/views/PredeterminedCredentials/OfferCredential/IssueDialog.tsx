import React from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid, Box } from '@mui/material';
import Button from '~ui/atoms/Button/Button';
import { Clothe } from '~models/clothes';
// import ShowCredential from './ShowCredential';
import { CredentialSchemaModel } from '~models/digital_identity/credential';
// import Credential from '~molecules/Credential';
import PreviewCredential from './PreviewCredential';

type IssueDialogProps = {
  open: boolean;
  credentialSchema: CredentialSchemaModel;
  subjectEntitiesSelected: Clothe[];
  clothe?: Clothe;
  closeAction(isUpdateTable?: boolean): void;
  organizationTheme: any;
  handleIssueCredentials(entities: any[]): Promise<void>;
  showProduct: boolean;
};

const IssueDialog: React.FC<IssueDialogProps> = (props: IssueDialogProps) => {
  const { open, clothe, credentialSchema, closeAction, handleIssueCredentials, showProduct, organizationTheme } = props;

  return (
    <Dialog
      open={open}
      title={'!Solo un paso más!'}
      subtitle="Llegamos al último paso, por favor asegúrate que sean los datos para emitir el certificado de forma correcta."
      onClose={() => closeAction()}
      hideActions
      actions={<></>}
    >
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          {/* <Typography fontWeight={700}>Certificado a emitir:</Typography> */}
          {/* <ShowCredential credentialSchema={credentialSchema} /> */}

          <PreviewCredential
            clothe={clothe}
            issuedCredential={credentialSchema}
            organizationTheme={organizationTheme}
            showProduct={showProduct}
          />
          <Box mt={{ xs: 2, md: 4 }} display="flex" justifyContent="space-between">
            <Button text="Volver" sx={{ height: '100%' }} variant="contained" color="inherit" onClick={closeAction} />
            <Button
              text="Emitir certificado"
              variant="contained"
              onClick={() => {
                handleIssueCredentials([clothe]);
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default React.memo(IssueDialog);
