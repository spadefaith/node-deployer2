import 'dotenv/config';
import { Hono } from 'hono';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { html, raw } from 'hono/html';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.resolve(path.dirname(decodeURI(new URL(import.meta.url).pathname)));
const server = express();

import { swaggerUI } from '@hono/swagger-ui';

import PermissionModule from './modules/admin/permission';
import RoleModule from './modules/admin/role';
import RolePermissionModule from './modules/admin/role-permission';
import AccountModule from './modules/admin/account';
import AuthModule from './modules/admin/auth';
import AuthClienModule from './modules/client/auth';
import { HTTPException } from 'hono/http-exception';
import AppAdminModule from './modules/admin/app';
import EnvAdminModule from './modules/admin/env';


server.use('/api/admin/app', AppAdminModule);
server.use('/api/admin/account', AccountModule);

// server.use('/admin/permission', PermissionModule);
// server.use('/admin/role', RoleModule);
// server.use('/admin/role-permission', RolePermissionModule);
// server.use('/admin/auth', AuthModule);
// server.use('/admin/env', EnvAdminModule);
// server.use('/client/auth', AuthClienModule);




export default server;
