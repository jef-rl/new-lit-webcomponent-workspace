{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.git
  ];
  idx = {
    workspace = {
      onCreate = {
        npm-install = "npm install";
      };
    };
  };
}
