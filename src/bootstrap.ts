import {config, DotenvConfigOptions} from 'dotenv';
import {join} from 'path';

let options: DotenvConfigOptions = {
  path: join(__dirname, '../.env')
}

config(options);
