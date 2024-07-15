import React from 'react';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';

const useStyles: any = makeStyles(() => ({
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '312px',
    height: '217px'
  },
  component: {
    position: 'absolute'
  }
}));

const WelcomeImage = () => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div className={classes.container}>
      <div className={classes.component}>
        <svg xmlns="http://www.w3.org/2000/svg" width="312" height="218" viewBox="0 0 312 218" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 120.084C0 145.128 9.7145 167.95 25.7004 185.198C44.0397 204.991 70.6337 217.435 100.277 217.477C113.233 217.495 125.62 215.129 136.999 210.81C142.882 208.576 149.467 208.832 155.166 211.479C161.85 214.58 169.334 216.318 177.238 216.318C180.502 216.318 183.7 216.019 186.792 215.452C195.62 213.839 203.653 210.021 210.251 204.614C214.397 201.215 219.707 199.506 225.134 199.512H225.226C243.159 199.512 259.816 194.237 273.646 185.198C286.01 177.127 296.106 166.05 302.833 153.044C308.698 141.711 312 128.908 312 115.358C312 68.8841 273.147 31.2039 225.226 31.2039C220.341 31.2039 215.555 31.6041 210.885 32.3508C198.521 12.9399 176.381 0 151.124 0C140.461 0 130.351 2.30627 121.302 6.44047C112.696 10.3594 105.045 15.9279 98.7859 22.7143C77.5329 23.0429 57.8812 29.7762 41.7969 41.0134C16.4784 58.6917 0 87.5238 0 120.084Z"
            fill="url(#paint0_linear_144_8549)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_144_8549"
              x1="-8.71718e-07"
              y1="108.739"
              x2="312"
              y2="108.739"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor={theme.palette.gradients.additional1} />
              <stop offset="1" stopColor={theme.palette.gradients.additional2} />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className={classes.component}>
        <svg xmlns="http://www.w3.org/2000/svg" width="236" height="141" viewBox="0 0 236 141" fill="none">
          <path
            d="M56.6596 15.3872C56.6596 15.3872 3.5922 38.357 1.76579 70.3401C-0.0606258 102.323 99.0054 96.5559 120.669 110.348C142.332 124.139 236.223 145.099 234.414 121.075C232.604 97.0503 210.298 88.762 210.298 88.762"
            stroke="white"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeDasharray="3 2"
          />
          <path
            opacity="0.8"
            d="M195.62 118.669L163.235 34.4683C162.705 33.098 161.76 31.9176 160.524 31.0845C159.288 30.2513 157.821 29.8051 156.318 29.8052H19.946C17.989 29.8095 16.1136 30.5701 14.7313 31.92C13.349 33.27 12.5727 35.099 12.5727 37.0059C12.575 37.7378 12.689 38.4653 12.9109 39.1645L44.2475 134.735C44.7584 136.281 45.7929 137.611 47.1816 138.51C48.5704 139.408 50.2309 139.82 51.8914 139.678L189.346 128.308C191.299 128.153 193.109 127.248 194.377 125.793C195.646 124.337 196.269 122.451 196.11 120.547C196.031 119.903 195.866 119.272 195.62 118.669Z"
            fill="black"
            fillOpacity="0.25"
          />
          <path
            d="M16.5633 30.7448L47.9506 126.364C48.47 127.908 49.509 129.236 50.8992 130.133C52.2895 131.03 53.9498 131.444 55.6114 131.308L96.7733 127.913L192.981 119.905C193.949 119.832 194.891 119.574 195.756 119.145C196.62 118.716 197.389 118.124 198.017 117.404C198.646 116.684 199.122 115.851 199.419 114.951C199.716 114.051 199.827 113.103 199.746 112.161C199.677 111.484 199.518 110.82 199.272 110.183L191.578 90.4103L177.66 54.1595L166.87 26.1475C166.341 24.7772 165.395 23.5968 164.159 22.7637C162.924 21.9305 161.456 21.4843 159.954 21.4844H23.5815C22.6132 21.4844 21.6544 21.6702 20.7598 22.0312C19.8652 22.3923 19.0524 22.9215 18.3678 23.5886C17.6831 24.2557 17.14 25.0477 16.7694 25.9193C16.3989 26.791 16.2082 27.7252 16.2082 28.6686C16.2183 29.3742 16.338 30.0742 16.5633 30.7448Z"
            fill="white"
          />
          <path
            d="M96.2745 127.954L55.6122 131.307C53.9506 131.444 52.2903 131.03 50.9001 130.133C49.5098 129.236 48.4709 127.908 47.9514 126.364L16.5641 30.7443C16.3388 30.0737 16.2191 29.3737 16.209 28.6681C16.209 27.7247 16.3997 26.7905 16.7703 25.9188C17.1408 25.0472 17.6839 24.2552 18.3686 23.5881C19.0533 22.921 19.8661 22.3918 20.7607 22.0308C21.6552 21.6697 22.614 21.4839 23.5823 21.4839H60.9262L96.2745 127.954Z"
            fill={theme.palette.primary.light}
          />
          <path
            d="M131.663 74.3353C134.291 74.1761 136.051 71.5641 135.212 69.0679L130.662 55.5335C130.092 53.8396 128.468 52.729 126.683 52.8126L89.587 54.5495C86.9053 54.675 85.1061 57.3544 86.0048 59.8841L90.9848 73.9025C91.5814 75.5818 93.217 76.6639 94.9959 76.5562L131.663 74.3353Z"
            fill={theme.palette.primary.lighter}
          />
          <path
            d="M142.713 104.736C145.342 104.576 147.102 101.964 146.263 99.4683L141.712 85.9339C141.143 84.24 139.519 83.1294 137.734 83.213L100.638 84.9499C97.956 85.0754 96.1569 87.7548 97.0556 90.2845L102.036 104.303C102.632 105.982 104.268 107.064 106.047 106.957L142.713 104.736Z"
            fill={theme.palette.primary.lighter}
          />
          <path
            opacity="0.18"
            d="M149.858 38.3243L160.225 71.8233C160.378 72.3628 160.709 72.8379 161.168 73.1747C161.627 73.5114 162.187 73.6909 162.761 73.6853L187.469 72.9903C188.848 72.9515 189.774 71.5612 189.279 70.2735L176.821 37.8654C176.539 37.1317 175.854 36.6312 175.069 36.5863L152.175 35.276C151.791 35.2602 151.409 35.3362 151.063 35.4975C150.716 35.6588 150.415 35.9005 150.187 36.2012C149.958 36.502 149.809 36.8529 149.751 37.223C149.694 37.5931 149.731 37.9712 149.858 38.3243Z"
            fill={theme.palette.primary.main}
          />
          <path
            d="M212.953 63.5844L202.232 34.0071C202.067 33.5323 201.763 33.1151 201.357 32.8075C200.951 32.4998 200.461 32.3153 199.949 32.277L154.762 29.6735C154.377 29.6618 153.995 29.741 153.649 29.9043C153.302 30.0676 153.002 30.3102 152.772 30.6114C152.543 30.9125 152.392 31.2632 152.332 31.6336C152.272 32.004 152.305 32.383 152.428 32.7383L162.795 66.2538C162.949 66.7935 163.281 67.2692 163.739 67.6083C164.197 67.9474 164.756 68.1314 165.331 68.1322L210.89 66.7976C211.27 66.7761 211.64 66.6662 211.968 66.4771C212.295 66.2879 212.572 66.025 212.774 65.7104C212.976 65.3958 213.097 65.0385 213.129 64.6687C213.16 64.2988 213.1 63.927 212.953 63.5844Z"
            fill="white"
          />
          <path
            d="M197.485 58.7879C197.649 59.2045 197.732 59.4128 197.844 59.5846C198.135 60.0277 198.59 60.3372 199.109 60.445C199.311 60.4868 199.535 60.4868 199.982 60.4868C200.881 60.4868 201.33 60.4868 201.649 60.3762C202.484 60.0862 203.03 59.2821 202.991 58.3988C202.976 58.0618 202.81 57.6443 202.478 56.8094L201.568 54.5174C201.403 54.1033 201.321 53.8963 201.209 53.7254C200.917 53.2825 200.462 52.9734 199.943 52.8661C199.742 52.8247 199.52 52.8247 199.074 52.8247C198.18 52.8247 197.734 52.8247 197.416 52.9344C196.58 53.2233 196.033 54.0277 196.071 54.9119C196.086 55.2473 196.25 55.6629 196.578 56.4941L197.485 58.7879Z"
            fill={theme.palette.primary.main}
          />
          <path
            d="M183.228 58.7887C183.393 59.2052 183.475 59.4135 183.588 59.5852C183.879 60.028 184.334 60.3372 184.853 60.4449C185.054 60.4867 185.278 60.4867 185.726 60.4867C186.625 60.4867 187.074 60.4867 187.393 60.376C188.228 60.086 188.774 59.2821 188.735 58.3989C188.72 58.0618 188.554 57.6441 188.222 56.8088L186.585 52.6876C186.42 52.2741 186.338 52.0673 186.226 51.8967C185.934 51.4534 185.479 51.1441 184.959 51.0369C184.759 50.9956 184.537 50.9956 184.092 50.9956C183.199 50.9956 182.752 50.9956 182.435 51.105C181.598 51.394 181.05 52.1993 181.09 53.0842C181.104 53.4193 181.269 53.8345 181.597 54.665L183.228 58.7887Z"
            fill={theme.palette.primary.main}
          />
          <path
            d="M176.107 58.7907C176.273 59.2076 176.356 59.416 176.469 59.5878C176.76 60.029 177.214 60.3371 177.731 60.4448C177.933 60.4867 178.157 60.4867 178.606 60.4867C179.506 60.4867 179.957 60.4867 180.276 60.3755C181.11 60.0852 181.655 59.2828 181.617 58.4009C181.602 58.063 181.436 57.6444 181.104 56.8072L175.087 41.6515C174.921 41.2347 174.838 41.0263 174.725 40.8545C174.434 40.4132 173.98 40.1051 173.463 39.9975C173.261 39.9556 173.037 39.9556 172.588 39.9556C171.688 39.9556 171.237 39.9556 170.918 40.0668C170.084 40.357 169.539 41.1594 169.577 42.0413C169.592 42.3792 169.758 42.7978 170.09 43.6351L176.107 58.7907Z"
            fill={theme.palette.primary.main}
          />
          <path
            d="M190.363 58.7909C190.529 59.2077 190.612 59.4161 190.725 59.5879C191.016 60.0291 191.47 60.3372 191.987 60.4448C192.189 60.4867 192.413 60.4867 192.861 60.4867C193.762 60.4867 194.212 60.4867 194.532 60.3755C195.366 60.0853 195.91 59.2828 195.872 58.4009C195.858 58.063 195.692 57.6444 195.359 56.8072L191.304 46.5947C191.139 46.178 191.056 45.9696 190.943 45.7978C190.652 45.3566 190.198 45.0485 189.68 44.9408C189.479 44.8989 189.255 44.8989 188.806 44.8989C187.905 44.8989 187.455 44.8989 187.136 45.0101C186.302 45.3004 185.757 46.1029 185.795 46.9848C185.81 47.3227 185.976 47.7413 186.308 48.5785L190.363 58.7909Z"
            fill={theme.palette.primary.main}
          />
          <path
            d="M168.971 58.7894C169.136 59.2067 169.219 59.4153 169.333 59.5873C169.624 60.0286 170.077 60.3368 170.595 60.4445C170.796 60.4865 171.021 60.4865 171.47 60.4865C172.371 60.4865 172.821 60.4865 173.141 60.3752C173.974 60.085 174.519 59.2832 174.481 58.4017C174.467 58.0637 174.301 57.6449 173.969 56.8073L165.683 35.9183C165.518 35.501 165.435 35.2924 165.322 35.1204C165.031 34.6791 164.577 34.3709 164.06 34.2632C163.858 34.2212 163.634 34.2212 163.185 34.2212C162.284 34.2212 161.833 34.2212 161.514 34.3325C160.681 34.6227 160.136 35.4245 160.173 36.306C160.188 36.644 160.354 37.0628 160.686 37.9004L168.971 58.7894Z"
            fill={theme.palette.primary.main}
          />
          <path
            d="M36.1122 51.3909C35.4363 48.9508 35.771 46.3497 37.0442 44.1477C38.3175 41.9457 40.4273 40.319 42.9195 39.618C45.4116 38.917 48.0867 39.1977 50.3685 40.3996C52.6503 41.6016 54.3563 43.6287 55.1191 46.0444C55.882 48.46 55.6406 51.0709 54.447 53.3149C53.2533 55.5588 51.203 57.2562 48.7374 58.0415C46.2719 58.8268 43.5885 58.6371 41.265 57.5134C38.9416 56.3897 37.164 54.4218 36.3152 52.0336L36.2137 51.7205L36.1122 51.3909Z"
            fill="white"
          />
          <path
            d="M57.7411 112.572C57.2321 110.18 57.6694 107.689 58.9654 105.597C60.2615 103.506 62.3206 101.969 64.7304 101.294C67.1402 100.619 69.7227 100.856 71.9608 101.957C74.199 103.058 75.9274 104.943 76.8 107.233C76.8 107.332 76.8 107.448 76.8 107.547C76.8 107.645 76.8 107.761 76.9184 107.86C77.588 110.206 77.3245 112.712 76.1804 114.878C75.0363 117.043 73.0959 118.708 70.7468 119.541C68.3977 120.373 65.8128 120.311 63.5084 119.368C61.204 118.424 59.3497 116.668 58.3161 114.451C58.2146 114.138 58.13 113.825 58.0286 113.511C57.9271 113.198 57.8595 112.885 57.7411 112.572Z"
            fill="white"
          />
          <path
            d="M47.6286 78.7109C47.6286 76.1457 48.6745 73.6855 50.5361 71.8715C52.3978 70.0576 54.9227 69.0386 57.5555 69.0386C60.1883 69.0386 62.7132 70.0576 64.5749 71.8715C66.4366 73.6855 67.4824 76.1457 67.4824 78.7109V79.3865C67.4824 81.9518 66.4366 84.412 64.5749 86.2259C62.7132 88.0398 60.1883 89.0589 57.5555 89.0589C54.9227 89.0589 52.3978 88.0398 50.5361 86.2259C48.6745 84.412 47.6286 81.9518 47.6286 79.3865V78.7109Z"
            fill="white"
          />
          <path
            d="M45.9889 48.7379L43.6552 41.4384C44.3141 41.2407 44.9959 41.1245 45.6845 41.0923C47.4067 41.0292 49.1025 41.5191 50.511 42.4867C51.9196 43.4543 52.9629 44.8459 53.4806 46.4476C53.6835 47.0896 53.8028 47.7539 53.8357 48.4249C53.8571 49.0944 53.7947 49.7639 53.6497 50.4187C53.351 51.7274 52.6969 52.9339 51.7557 53.9119C50.8279 54.9066 49.6443 55.6419 48.3272 56.0417C47.0102 56.4414 45.6074 56.4912 44.264 56.1858C43.6019 56.0348 42.9605 55.8081 42.353 55.5102C41.7424 55.1957 41.1743 54.8082 40.6619 54.3568C39.6634 53.4565 38.9181 52.3219 38.4973 51.0613L45.9889 48.7379Z"
            fill={theme.palette.primary.main}
          />
          <path
            d="M57.4212 79.024V71.3784C58.7937 71.3885 60.14 71.7463 61.3277 72.4165C61.9482 72.7423 62.5177 73.1529 63.0188 73.6359C63.9973 74.5821 64.7015 75.7637 65.0597 77.0609C65.418 78.358 65.4176 79.7244 65.0586 81.0213C64.6997 82.3182 63.9949 83.4995 63.0159 84.4452C62.0369 85.391 60.8185 86.0674 59.4844 86.406C58.157 86.7682 56.7531 86.7682 55.4257 86.406C54.7642 86.2394 54.1276 85.9901 53.5316 85.6645L57.4212 79.024Z"
            fill={theme.palette.primary.main}
          />
          <path
            d="M67.4483 110.529L65.013 103.262C66.325 102.855 67.7223 102.781 69.0717 103.048C70.7628 103.398 72.288 104.282 73.4103 105.564C74.5326 106.845 75.1892 108.451 75.2782 110.134C75.3151 110.797 75.2581 111.462 75.109 112.111C74.9705 112.764 74.743 113.395 74.4326 113.989C73.9763 114.881 73.3441 115.676 72.5722 116.329C71.8003 116.982 70.9039 117.48 69.9342 117.796L67.499 110.513L67.4483 110.529Z"
            fill={theme.palette.primary.main}
          />
          <path d="M83.6504 1.24951L66.3164 9.0599L69.242 19.0124L83.6504 1.24951Z" fill={theme.palette.primary.main} />
          <path d="M83.6504 1.24951H56.6432L64.862 6.14336L83.6504 1.24951Z" fill={theme.palette.primary.main} />
          <path
            d="M61.7334 13.4594L66.3164 9.0599L83.6504 1.24951L64.862 6.14336L61.7334 13.4594Z"
            fill={theme.palette.primary.main}
          />
          <path
            d="M61.7334 13.4594L66.3164 9.0599L83.6504 1.24951L61.7334 13.4594Z"
            fill={theme.palette.primary.main}
          />
          <path
            d="M61.7334 13.4594L66.3164 9.0599L83.6504 1.24951L64.862 6.14336L61.7334 13.4594Z"
            fill={theme.palette.primary.main}
          />
        </svg>
      </div>
    </div>
  );
};

export default WelcomeImage;
