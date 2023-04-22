import Dropzone from './Dropzone';
import type { UploadProps } from './Upload';
import InternalUpload, { LIST_IGNORE } from './Upload';

export type { DropzoneProps } from './Dropzone';
export { UploadSize } from './Upload.types';
export type {
  OcFile,
  UploadChangeParam,
  UploadFile,
  UploadFileStatus,
  UploadListProps,
  UploadProps,
} from './Upload.types';

type InternalUploadType = typeof InternalUpload;
interface UploadInterface<T = any> extends InternalUploadType {
  <U extends T>(
    props: React.PropsWithChildren<UploadProps<U>> & React.RefAttributes<any>
  ): React.ReactElement;
  Dropzone: typeof Dropzone;
  LIST_IGNORE: string;
}

const Upload = InternalUpload as UploadInterface;
Upload.Dropzone = Dropzone;
Upload.LIST_IGNORE = LIST_IGNORE;

export { UploadInterface };

export default Upload;
