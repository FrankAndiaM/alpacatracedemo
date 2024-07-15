import swal from 'sweetalert';

const showMessage = (title: string, text: string, icon: string, dangerMode: boolean = false): void => {
  swal({
    title,
    text,
    icon,
    dangerMode
  });
};

const showYesNoQuestion = async (
  title: string,
  text: string,
  icon: 'warning' | 'error' | 'success' | 'info' = 'warning',
  dangerMode: boolean = false,
  buttons: string[] = ['Cancelar', 'Aceptar']
) => {
  return swal({
    title,
    text,
    icon,
    dangerMode,
    buttons
  });
};

const showDeleteQuestion = async (
  title: string,
  text: string,
  icon: 'warning' | 'error' | 'success' | 'info' = 'warning',
  dangerMode: boolean = true,
  buttons: string[] = ['Cancelar', 'Eliminar']
) => {
  return swal({
    title,
    text,
    icon,
    dangerMode,
    buttons
  });
};

export { showMessage, showYesNoQuestion, showDeleteQuestion };
