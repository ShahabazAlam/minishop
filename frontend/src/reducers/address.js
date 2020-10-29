import _ from 'lodash';

import {
    ADDRESS_SAVING,
    ADDRESS_SAVED_SUCCESSFULLY,
    ADDESS_SAVING_FAIED,
    ADDRESS_FETCHED_SUCCESSFULLY,
    ADDRESS_FETCHING,
    ADDRESS_FETCHING_FAIED,
    ADDRESS_DELETING,
    ADDRESS_DELETING_SUCCESSFULLY,
    ADDRESS_DELETING_FAIED,
    ADDRESS_UPDATING,
    ADDRESS_UPDATE_SUCCESSFULLY,
    ADDRESS_UPDATE_FAILED,
} from '../actions/Types';

const initialState = {
    error: null,
    success: false,
    message: null,
    fetching: false,
    addresses: [],
    saving: false,
    deleting: false,
    updating: false,
};
export default (state = initialState, action) => {
    switch (action.type) {
        case ADDRESS_FETCHING:
            return {
                fetching: true,
                addresses: [...state.addresses],
            };
        case ADDRESS_FETCHED_SUCCESSFULLY:
            return {
                addresses: action.address,
                fetching: false,
                success: true,
            };
        case ADDRESS_FETCHING_FAIED:
            return {
                message: action.error,
                fetching: false,
            }
        case ADDRESS_SAVING:
            return {
                saving: true,
                addresses: [...state.addresses],
            }

        case ADDRESS_SAVED_SUCCESSFULLY:
            return {
                addresses: [...state.addresses, action.address],
                saving: false,
            }
        case ADDESS_SAVING_FAIED:
            return {
                saving: false,
                addresses: [...state.addresses],
                message: action.error
            }
        case ADDRESS_DELETING:
            return {
                deleting: true,
                addresses: [...state.addresses],
            }

        case ADDRESS_DELETING_SUCCESSFULLY:
            return {
                addresses: [...state.addresses.filter(value => value.id !== action.deleted_address)],
                deleting: false,
            }
        case ADDRESS_DELETING_FAIED:
            return {
                deleting: false,
                addresses: [...state.addresses],
                message: action.error
            }
        case ADDRESS_UPDATE_FAILED:
            return {
                updating: false,
                addresses: [...state.addresses],
                message: action.error
            }
        case ADDRESS_UPDATING:
            return {
                updating: true,
                addresses: [...state.addresses],
            }
        case ADDRESS_UPDATE_SUCCESSFULLY:
            return {
                addresses: [...state.addresses],
                updating: false,
            }

        default:
            return state;
    }
};
