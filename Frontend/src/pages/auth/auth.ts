import * as lib from "@lib/lib.ts";

let user = null;

export function getUser() {
  return user;
}

export async function setUser(newUser) {
  if(newUser === null) {
    user = null;
  } else{
    const find = await lib.fetchUserByUsername(newUser.nickname);
    if (find === null) {
      user = await lib.createUser(newUser.nickname, newUser.name, 'Auth0', '');
    }else{
      user = find;
    }
  }
  
}