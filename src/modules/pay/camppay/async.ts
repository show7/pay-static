import { pget, ppost } from "utils/request";

export function signupCamp(){
  return pget('/signup/current/camp/month')
}

export function createCampGroup(){
  return ppost('/rise/operation/group/create')
}

export function isFollowing(){
  return pget('/rise/operation/group/following')
}

export function joinCampGroup(groupCode){
  return ppost(`/rise/operation/group/participate?groupCode=${groupCode}`)
}

