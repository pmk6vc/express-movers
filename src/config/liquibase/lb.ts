import {
  Liquibase,
  LiquibaseConfig,
  POSTGRESQL_DEFAULT_CONFIG,
} from "liquibase";
import environment from "../ConfigFactory";

const lbConfig: LiquibaseConfig = {
  ...POSTGRESQL_DEFAULT_CONFIG,
  changeLogFile: "/liquibase/main.yaml",
  url: environment.database.url,
  username: environment.database.username,
  password: environment.database.password,
};

export default new Liquibase(lbConfig);
