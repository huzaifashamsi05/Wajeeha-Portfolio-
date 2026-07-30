import { createClient } from '@libsql/client';

const db = createClient({
    url: process.env.TURSO_DATABASE_URL || 'libsql://portfolio-huzaifashamsi05.aws-ap-south-1.turso.io',
    authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODU0MDY1MDMsImlkIjoiMDE5ZmIyODQtNDMwMS03MmVmLThiZWEtMWUyYmVkZGU0YmI5Iiwia2lkIjoiS3J4TDBsa0pJVWpKRGNsWkhkZXpKMFJSVkExOGtCd3UtYXdIYy13OUJXbyIsInJpZCI6ImNlZTg2ZjY0LTI1ODctNDhjNi04MjBlLWI5Yzg4MjAzM2Y4YSJ9.9YxRGHPyR2K_B_KcPqtpnDfsfyr1J4Rx5_OyWb3lPQ-R4X7J6c2iW-aCsCUPw364NPQj85jeSeBGWD1GMnJyBg'
});

export { db };
