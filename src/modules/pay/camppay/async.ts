import { pget, ppost } from "utils/request";

export function signupCamp(){
  return pget('/signup/current/camp/month')
}

export function createCampGroup(){
  return ppost('/rise/operation/group/create')
}

export function isFollowing(groupCode){
  return pget(`/rise/operation/group/following?groupCode=${groupCode}`)
}

export function joinCampGroup(groupCode){
  return ppost(`/rise/operation/group/participate?groupCode=${groupCode}`)
}

export function getLeaderInfo(groupCode){
  return pget(`/rise/operation/group/leader?groupCode=${groupCode}`)
}

