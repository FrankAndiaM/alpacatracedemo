import AWS from 'aws-sdk';
import {
  AWS_REGION,
  AWS_COGNITO_APP_CLIENT_ID,
  AWS_COGNITO_USER_POOL_ID,
  AWS_COGNITO_IDENTITY_POOL_ID
} from '../../config/environment';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  ICognitoUserPoolData,
  ICognitoUserData
} from 'amazon-cognito-identity-js';
import { CognitoCredentials, CognitoChangePassword, CognitoForgotPassword } from '~models/cognito';

export default class CognitoAWS {
  private userPool: CognitoUserPool;

  constructor() {
    const poolData: ICognitoUserPoolData = {
      UserPoolId: AWS_COGNITO_USER_POOL_ID,
      ClientId: AWS_COGNITO_APP_CLIENT_ID
    };
    this.userPool = new CognitoUserPool(poolData);
  }

  /**
   * * Log in on Cognito
   * @param  {CognitoCredentials} user
   */
  logIn(user: CognitoCredentials): Promise<any> {
    const userData: ICognitoUserData = {
      Username: user.username,
      Pool: this.userPool
    };
    const cognitoUser = new CognitoUser(userData);

    const authenticationData = {
      Username: user.username,
      Password: user.password
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve: any, reject: any) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session: CognitoUserSession) => {
          const cognito = `cognito-idp.${AWS_REGION}.amazonaws.com/${AWS_COGNITO_USER_POOL_ID}`;
          AWS.config.region = AWS_REGION;
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,
            Logins: {
              [cognito]: session.getIdToken().getJwtToken()
            }
          });
          // eslint-disable-next-line
          // @ts-ignore
          AWS.config.credentials.refresh((error: any) => {
            if (error) reject(error);
            resolve(session);
          });
        },
        onFailure: (err: any) => {
          reject(err);
        },
        newPasswordRequired: () => {
          if (!user.newPassword) {
            const data = {
              message: 'Se requiere modificar la clave',
              code: 'NewPasswordRequired'
            };
            reject(data);
          }
          cognitoUser.completeNewPasswordChallenge(
            String(user.newPassword),
            {},
            {
              onSuccess: (result: CognitoUserSession) => {
                const cognito = `cognito-idp.${AWS_REGION}.amazonaws.com/${AWS_COGNITO_USER_POOL_ID}`;
                AWS.config.region = AWS_REGION;
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                  IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,
                  Logins: {
                    [cognito]: result.getIdToken().getJwtToken()
                  }
                });
                resolve(result);
              },
              onFailure: (err: any) => {
                reject(err);
              }
            }
          );
        }
      });
    });
  }

  /**
   * *Sign out
   * @returns Promise
   */

  signOut() {
    return new Promise((resolve: any, reject: any) => {
      // cognitoUser.signOut();
      const currentUser = this.userPool.getCurrentUser();
      if (currentUser) {
        // obtiene la session para poder cerrarla
        currentUser.getSession((err: any) => {
          if (err) {
            reject(err);
            return;
          }
        });
        currentUser.globalSignOut({
          onSuccess: (msg: string) => {
            resolve({
              name: '',
              message: msg
            });
          },
          onFailure: (err: Error) => {
            reject(err);
          }
        });
      } else {
        reject({
          name: '',
          message: 'Error'
        });
      }
    });
  }

  /**
   * * Validate active session
   * @returns Promise
   */
  validateActiveSession(): Promise<any> {
    const currentUser = this.userPool.getCurrentUser();
    return new Promise((resolve: any, reject: any) => {
      if (currentUser) {
        currentUser.getSession((err: any, session: any) => {
          if (err) {
            reject(err);
            return;
          }
          const cognito = `cognito-idp.${AWS_REGION}.amazonaws.com/${AWS_COGNITO_USER_POOL_ID}`;
          // se refrescan los atributos por si hayan cambiado las key de acceso
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,
            Logins: {
              [cognito]: session?.getIdToken()?.getJwtToken()
            }
          });
          resolve(session);
        });
      }
      reject(false);
    });
  }

  /**
   * * Refresh token
   * @returns Promise
   */
  refreshToken(): Promise<any> {
    const currentUser = this.userPool.getCurrentUser();
    return new Promise((resolve: any, reject: any) => {
      if (currentUser) {
        currentUser.getSession((err: any, session: any) => {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }
          const refresh_token = session.getRefreshToken();
          // se refrescan los atributos por si hayan cambiado las key de acceso
          currentUser.refreshSession(refresh_token, (err: any, session: any) => {
            if (err) {
              console.error(err);
              reject(false);
            }
            const cognito = `cognito-idp.${AWS_REGION}.amazonaws.com/${AWS_COGNITO_USER_POOL_ID}`;
            AWS.config.region = AWS_REGION;
            try {
              // eslint-disable-next-line
              // @ts-ignore
              AWS.config.credentials.params.Logins[cognito] = session?.getIdToken()?.getJwtToken();
            } catch (error) {
              console.error(error);
              console.warn('Problems to load jwt token');
            }

            // eslint-disable-next-line
            // @ts-ignore
            AWS?.config?.credentials?.refresh((err: any) => {
              if (err) {
                console.error('refresh', err);
                reject(err);
              }
              resolve(session);
            });
          });
        });
      } else {
        reject(false);
      }
    });
  }

  /**
   * * Confirmed registration on Cognito
   * @param  {CognitoCredentials} user
   * @returns Promise
   */
  confirmedRegistration(user: CognitoCredentials): Promise<any> {
    const userData: ICognitoUserData = {
      Username: user.username,
      Pool: this.userPool
    };
    const cognitoUser = new CognitoUser(userData);

    // eslint-disable-next-line no-undef
    return new Promise((resolve: any, reject: any) => {
      user.verifyCode &&
        cognitoUser.confirmRegistration(user.verifyCode, true, (err: any, result: any) => {
          if (err) reject(err);
          resolve(result);
        });
    });
  }

  /**
   * *Reenvia el código de verificación al celular o email de un usuario
   * @param  {CognitoCredentials} user
   */
  resendConfirmationCode(user: CognitoCredentials) {
    const userData: ICognitoUserData = {
      Username: user.username,
      Pool: this.userPool
    };
    const cognitoUser = new CognitoUser(userData);

    // eslint-disable-next-line no-undef
    return new Promise((resolve: any, reject: any) => {
      cognitoUser.resendConfirmationCode((err: any, result: any) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  /**
   * Reenvia el código de verificación al celular o email de un usuario
   * @param  {CognitoCredentials} user
   */
  changePassword(user: CognitoChangePassword): Promise<any> {
    const currentUser = this.userPool.getCurrentUser();
    return new Promise((resolve: any, reject: any) => {
      if (currentUser) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        currentUser.getSession((err: any, session: any) => {
          if (err) {
            reject(err);
            return;
          }
          currentUser.changePassword(user.oldPassword, user.newPassword, (err: any, passSession: any) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(passSession);
          });
        });
      } else {
        reject(false);
      }
    });
  }

  /**
   * Modifica password
   * @param  {CognitoUser} CognitoUser
   */

  forgotPassword(username: string): Promise<any> {
    const userData: ICognitoUserData = {
      Username: username,
      Pool: this.userPool
    };
    const cognitoUser = new CognitoUser(userData);

    // eslint-disable-next-line no-undef
    return new Promise((resolve: any, reject: any) => {
      cognitoUser.forgotPassword({
        onSuccess: (result: any) => {
          resolve(result);
        },
        onFailure: (err: any) => {
          reject(err);
        }
      });
    });
  }

  /**
   * Confirma el nuevo password
   * @param  {CognitoForgotPassword} CognitoForgotPassword
   */

  confirmPassword(user: CognitoForgotPassword): Promise<any> {
    const userData: ICognitoUserData = {
      Username: user.username,
      Pool: this.userPool
    };
    const cognitoUser = new CognitoUser(userData);

    // eslint-disable-next-line no-undef
    return new Promise((resolve: any, reject: any) => {
      cognitoUser.confirmPassword(user.verificationCode, user.newPassword, {
        onSuccess() {
          resolve();
        },
        onFailure(err: any) {
          reject(err);
        }
      });
    });
  }
}
