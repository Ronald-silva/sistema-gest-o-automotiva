
export interface S3File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  contentDisposition: string;
  contentEncoding: string;
  storageClass: string;
  serverSideEncryption: string;
  metadata: any;
  location: string;
  etag: string;
}