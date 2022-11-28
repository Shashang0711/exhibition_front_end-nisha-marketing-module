import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = (type, message) => {
    toast.configure();
    if (type === 'success') {
        toast.success(message);
    } else if (type === 'error') {
        toast.error(message);
    }
}

export default Toast;
