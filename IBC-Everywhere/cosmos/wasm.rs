use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
};

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    // To do Initial setup code here
    Ok(Response::default())
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::LockTokens { amount, destination } => lock_tokens(deps, env, info, amount, destination),
        ExecuteMsg::UnlockTokens { recipient, amount } => unlock_tokens(deps, env, info, recipient, amount),
    }
}

fn lock_tokens(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    amount: u128,
    destination: String,
) -> StdResult<Response> {
    // To do Lock tokens logic here
    Ok(Response::new().add_attribute("method", "lock_tokens"))
}

fn unlock_tokens(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    recipient: String,
    amount: u128,
) -> StdResult<Response> {
    //To do Unlock tokens logic here
    Ok(Response::new().add_attribute("method", "unlock_tokens"))
}
