// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package escrow

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
	_ = abi.ConvertType
)

// EscrowMetaData contains all meta data concerning the Escrow contract.
var EscrowMetaData = &bind.MetaData{
	ABI: "[{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"jobId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"JobApproved\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"jobId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"freelancer\",\"type\":\"address\"}],\"name\":\"JobAssigned\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"jobId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"JobPublished\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"jobId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"Withdrawn\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"jobs\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"employer\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"freelancer\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"funded\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"completed\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"pendingWithdrawals\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\",\"constant\":true},{\"stateMutability\":\"payable\",\"type\":\"receive\",\"payable\":true},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"jobId\",\"type\":\"uint256\"}],\"name\":\"publishJob\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\",\"payable\":true},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"jobId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"freelancer\",\"type\":\"address\"}],\"name\":\"assignExecutor\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"jobId\",\"type\":\"uint256\"}],\"name\":\"approveJob\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"jobId\",\"type\":\"uint256\"}],\"name\":\"withdraw\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
}

// EscrowABI is the input ABI used to generate the binding from.
// Deprecated: Use EscrowMetaData.ABI instead.
var EscrowABI = EscrowMetaData.ABI

// Escrow is an auto generated Go binding around an Ethereum contract.
type Escrow struct {
	EscrowCaller     // Read-only binding to the contract
	EscrowTransactor // Write-only binding to the contract
	EscrowFilterer   // Log filterer for contract events
}

// EscrowCaller is an auto generated read-only Go binding around an Ethereum contract.
type EscrowCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// EscrowTransactor is an auto generated write-only Go binding around an Ethereum contract.
type EscrowTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// EscrowFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type EscrowFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// EscrowSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type EscrowSession struct {
	Contract     *Escrow           // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// EscrowCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type EscrowCallerSession struct {
	Contract *EscrowCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts // Call options to use throughout this session
}

// EscrowTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type EscrowTransactorSession struct {
	Contract     *EscrowTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// EscrowRaw is an auto generated low-level Go binding around an Ethereum contract.
type EscrowRaw struct {
	Contract *Escrow // Generic contract binding to access the raw methods on
}

// EscrowCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type EscrowCallerRaw struct {
	Contract *EscrowCaller // Generic read-only contract binding to access the raw methods on
}

// EscrowTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type EscrowTransactorRaw struct {
	Contract *EscrowTransactor // Generic write-only contract binding to access the raw methods on
}

// NewEscrow creates a new instance of Escrow, bound to a specific deployed contract.
func NewEscrow(address common.Address, backend bind.ContractBackend) (*Escrow, error) {
	contract, err := bindEscrow(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &Escrow{EscrowCaller: EscrowCaller{contract: contract}, EscrowTransactor: EscrowTransactor{contract: contract}, EscrowFilterer: EscrowFilterer{contract: contract}}, nil
}

// NewEscrowCaller creates a new read-only instance of Escrow, bound to a specific deployed contract.
func NewEscrowCaller(address common.Address, caller bind.ContractCaller) (*EscrowCaller, error) {
	contract, err := bindEscrow(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &EscrowCaller{contract: contract}, nil
}

// NewEscrowTransactor creates a new write-only instance of Escrow, bound to a specific deployed contract.
func NewEscrowTransactor(address common.Address, transactor bind.ContractTransactor) (*EscrowTransactor, error) {
	contract, err := bindEscrow(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &EscrowTransactor{contract: contract}, nil
}

// NewEscrowFilterer creates a new log filterer instance of Escrow, bound to a specific deployed contract.
func NewEscrowFilterer(address common.Address, filterer bind.ContractFilterer) (*EscrowFilterer, error) {
	contract, err := bindEscrow(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &EscrowFilterer{contract: contract}, nil
}

// bindEscrow binds a generic wrapper to an already deployed contract.
func bindEscrow(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := EscrowMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Escrow *EscrowRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Escrow.Contract.EscrowCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Escrow *EscrowRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Escrow.Contract.EscrowTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Escrow *EscrowRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Escrow.Contract.EscrowTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Escrow *EscrowCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Escrow.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Escrow *EscrowTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Escrow.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Escrow *EscrowTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Escrow.Contract.contract.Transact(opts, method, params...)
}

// Jobs is a free data retrieval call binding the contract method 0x180aedf3.
//
// Solidity: function jobs(uint256 ) view returns(address employer, address freelancer, uint256 amount, bool funded, bool approved, bool completed)
func (_Escrow *EscrowCaller) Jobs(opts *bind.CallOpts, arg0 *big.Int) (struct {
	Employer   common.Address
	Freelancer common.Address
	Amount     *big.Int
	Funded     bool
	Approved   bool
	Completed  bool
}, error) {
	var out []interface{}
	err := _Escrow.contract.Call(opts, &out, "jobs", arg0)

	outstruct := new(struct {
		Employer   common.Address
		Freelancer common.Address
		Amount     *big.Int
		Funded     bool
		Approved   bool
		Completed  bool
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.Employer = *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	outstruct.Freelancer = *abi.ConvertType(out[1], new(common.Address)).(*common.Address)
	outstruct.Amount = *abi.ConvertType(out[2], new(*big.Int)).(**big.Int)
	outstruct.Funded = *abi.ConvertType(out[3], new(bool)).(*bool)
	outstruct.Approved = *abi.ConvertType(out[4], new(bool)).(*bool)
	outstruct.Completed = *abi.ConvertType(out[5], new(bool)).(*bool)

	return *outstruct, err

}

// Jobs is a free data retrieval call binding the contract method 0x180aedf3.
//
// Solidity: function jobs(uint256 ) view returns(address employer, address freelancer, uint256 amount, bool funded, bool approved, bool completed)
func (_Escrow *EscrowSession) Jobs(arg0 *big.Int) (struct {
	Employer   common.Address
	Freelancer common.Address
	Amount     *big.Int
	Funded     bool
	Approved   bool
	Completed  bool
}, error) {
	return _Escrow.Contract.Jobs(&_Escrow.CallOpts, arg0)
}

// Jobs is a free data retrieval call binding the contract method 0x180aedf3.
//
// Solidity: function jobs(uint256 ) view returns(address employer, address freelancer, uint256 amount, bool funded, bool approved, bool completed)
func (_Escrow *EscrowCallerSession) Jobs(arg0 *big.Int) (struct {
	Employer   common.Address
	Freelancer common.Address
	Amount     *big.Int
	Funded     bool
	Approved   bool
	Completed  bool
}, error) {
	return _Escrow.Contract.Jobs(&_Escrow.CallOpts, arg0)
}

// PendingWithdrawals is a free data retrieval call binding the contract method 0xe6150400.
//
// Solidity: function pendingWithdrawals(uint256 ) view returns(uint256)
func (_Escrow *EscrowCaller) PendingWithdrawals(opts *bind.CallOpts, arg0 *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Escrow.contract.Call(opts, &out, "pendingWithdrawals", arg0)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// PendingWithdrawals is a free data retrieval call binding the contract method 0xe6150400.
//
// Solidity: function pendingWithdrawals(uint256 ) view returns(uint256)
func (_Escrow *EscrowSession) PendingWithdrawals(arg0 *big.Int) (*big.Int, error) {
	return _Escrow.Contract.PendingWithdrawals(&_Escrow.CallOpts, arg0)
}

// PendingWithdrawals is a free data retrieval call binding the contract method 0xe6150400.
//
// Solidity: function pendingWithdrawals(uint256 ) view returns(uint256)
func (_Escrow *EscrowCallerSession) PendingWithdrawals(arg0 *big.Int) (*big.Int, error) {
	return _Escrow.Contract.PendingWithdrawals(&_Escrow.CallOpts, arg0)
}

// ApproveJob is a paid mutator transaction binding the contract method 0x4bd23b9e.
//
// Solidity: function approveJob(uint256 jobId) returns()
func (_Escrow *EscrowTransactor) ApproveJob(opts *bind.TransactOpts, jobId *big.Int) (*types.Transaction, error) {
	return _Escrow.contract.Transact(opts, "approveJob", jobId)
}

// ApproveJob is a paid mutator transaction binding the contract method 0x4bd23b9e.
//
// Solidity: function approveJob(uint256 jobId) returns()
func (_Escrow *EscrowSession) ApproveJob(jobId *big.Int) (*types.Transaction, error) {
	return _Escrow.Contract.ApproveJob(&_Escrow.TransactOpts, jobId)
}

// ApproveJob is a paid mutator transaction binding the contract method 0x4bd23b9e.
//
// Solidity: function approveJob(uint256 jobId) returns()
func (_Escrow *EscrowTransactorSession) ApproveJob(jobId *big.Int) (*types.Transaction, error) {
	return _Escrow.Contract.ApproveJob(&_Escrow.TransactOpts, jobId)
}

// AssignExecutor is a paid mutator transaction binding the contract method 0x69c6a1c2.
//
// Solidity: function assignExecutor(uint256 jobId, address freelancer) returns()
func (_Escrow *EscrowTransactor) AssignExecutor(opts *bind.TransactOpts, jobId *big.Int, freelancer common.Address) (*types.Transaction, error) {
	return _Escrow.contract.Transact(opts, "assignExecutor", jobId, freelancer)
}

// AssignExecutor is a paid mutator transaction binding the contract method 0x69c6a1c2.
//
// Solidity: function assignExecutor(uint256 jobId, address freelancer) returns()
func (_Escrow *EscrowSession) AssignExecutor(jobId *big.Int, freelancer common.Address) (*types.Transaction, error) {
	return _Escrow.Contract.AssignExecutor(&_Escrow.TransactOpts, jobId, freelancer)
}

// AssignExecutor is a paid mutator transaction binding the contract method 0x69c6a1c2.
//
// Solidity: function assignExecutor(uint256 jobId, address freelancer) returns()
func (_Escrow *EscrowTransactorSession) AssignExecutor(jobId *big.Int, freelancer common.Address) (*types.Transaction, error) {
	return _Escrow.Contract.AssignExecutor(&_Escrow.TransactOpts, jobId, freelancer)
}

// PublishJob is a paid mutator transaction binding the contract method 0x5f3b221f.
//
// Solidity: function publishJob(uint256 jobId) payable returns()
func (_Escrow *EscrowTransactor) PublishJob(opts *bind.TransactOpts, jobId *big.Int) (*types.Transaction, error) {
	return _Escrow.contract.Transact(opts, "publishJob", jobId)
}

// PublishJob is a paid mutator transaction binding the contract method 0x5f3b221f.
//
// Solidity: function publishJob(uint256 jobId) payable returns()
func (_Escrow *EscrowSession) PublishJob(jobId *big.Int) (*types.Transaction, error) {
	return _Escrow.Contract.PublishJob(&_Escrow.TransactOpts, jobId)
}

// PublishJob is a paid mutator transaction binding the contract method 0x5f3b221f.
//
// Solidity: function publishJob(uint256 jobId) payable returns()
func (_Escrow *EscrowTransactorSession) PublishJob(jobId *big.Int) (*types.Transaction, error) {
	return _Escrow.Contract.PublishJob(&_Escrow.TransactOpts, jobId)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(uint256 jobId) returns()
func (_Escrow *EscrowTransactor) Withdraw(opts *bind.TransactOpts, jobId *big.Int) (*types.Transaction, error) {
	return _Escrow.contract.Transact(opts, "withdraw", jobId)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(uint256 jobId) returns()
func (_Escrow *EscrowSession) Withdraw(jobId *big.Int) (*types.Transaction, error) {
	return _Escrow.Contract.Withdraw(&_Escrow.TransactOpts, jobId)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(uint256 jobId) returns()
func (_Escrow *EscrowTransactorSession) Withdraw(jobId *big.Int) (*types.Transaction, error) {
	return _Escrow.Contract.Withdraw(&_Escrow.TransactOpts, jobId)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_Escrow *EscrowTransactor) Receive(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Escrow.contract.RawTransact(opts, nil) // calldata is disallowed for receive function
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_Escrow *EscrowSession) Receive() (*types.Transaction, error) {
	return _Escrow.Contract.Receive(&_Escrow.TransactOpts)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_Escrow *EscrowTransactorSession) Receive() (*types.Transaction, error) {
	return _Escrow.Contract.Receive(&_Escrow.TransactOpts)
}

// EscrowJobApprovedIterator is returned from FilterJobApproved and is used to iterate over the raw logs and unpacked data for JobApproved events raised by the Escrow contract.
type EscrowJobApprovedIterator struct {
	Event *EscrowJobApproved // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *EscrowJobApprovedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(EscrowJobApproved)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(EscrowJobApproved)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *EscrowJobApprovedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *EscrowJobApprovedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// EscrowJobApproved represents a JobApproved event raised by the Escrow contract.
type EscrowJobApproved struct {
	JobId  *big.Int
	Amount *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterJobApproved is a free log retrieval operation binding the contract event 0x72a8659d664e8c3afdc18cf46adfba3acd130a459e0658ed768a45b08c083620.
//
// Solidity: event JobApproved(uint256 indexed jobId, uint256 amount)
func (_Escrow *EscrowFilterer) FilterJobApproved(opts *bind.FilterOpts, jobId []*big.Int) (*EscrowJobApprovedIterator, error) {

	var jobIdRule []interface{}
	for _, jobIdItem := range jobId {
		jobIdRule = append(jobIdRule, jobIdItem)
	}

	logs, sub, err := _Escrow.contract.FilterLogs(opts, "JobApproved", jobIdRule)
	if err != nil {
		return nil, err
	}
	return &EscrowJobApprovedIterator{contract: _Escrow.contract, event: "JobApproved", logs: logs, sub: sub}, nil
}

// WatchJobApproved is a free log subscription operation binding the contract event 0x72a8659d664e8c3afdc18cf46adfba3acd130a459e0658ed768a45b08c083620.
//
// Solidity: event JobApproved(uint256 indexed jobId, uint256 amount)
func (_Escrow *EscrowFilterer) WatchJobApproved(opts *bind.WatchOpts, sink chan<- *EscrowJobApproved, jobId []*big.Int) (event.Subscription, error) {

	var jobIdRule []interface{}
	for _, jobIdItem := range jobId {
		jobIdRule = append(jobIdRule, jobIdItem)
	}

	logs, sub, err := _Escrow.contract.WatchLogs(opts, "JobApproved", jobIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(EscrowJobApproved)
				if err := _Escrow.contract.UnpackLog(event, "JobApproved", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseJobApproved is a log parse operation binding the contract event 0x72a8659d664e8c3afdc18cf46adfba3acd130a459e0658ed768a45b08c083620.
//
// Solidity: event JobApproved(uint256 indexed jobId, uint256 amount)
func (_Escrow *EscrowFilterer) ParseJobApproved(log types.Log) (*EscrowJobApproved, error) {
	event := new(EscrowJobApproved)
	if err := _Escrow.contract.UnpackLog(event, "JobApproved", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// EscrowJobAssignedIterator is returned from FilterJobAssigned and is used to iterate over the raw logs and unpacked data for JobAssigned events raised by the Escrow contract.
type EscrowJobAssignedIterator struct {
	Event *EscrowJobAssigned // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *EscrowJobAssignedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(EscrowJobAssigned)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(EscrowJobAssigned)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *EscrowJobAssignedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *EscrowJobAssignedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// EscrowJobAssigned represents a JobAssigned event raised by the Escrow contract.
type EscrowJobAssigned struct {
	JobId      *big.Int
	Freelancer common.Address
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterJobAssigned is a free log retrieval operation binding the contract event 0x3738a681a43a0b6a554742a08bae57e0215e8a774217dc2e7de6c9411b6d0ddc.
//
// Solidity: event JobAssigned(uint256 indexed jobId, address indexed freelancer)
func (_Escrow *EscrowFilterer) FilterJobAssigned(opts *bind.FilterOpts, jobId []*big.Int, freelancer []common.Address) (*EscrowJobAssignedIterator, error) {

	var jobIdRule []interface{}
	for _, jobIdItem := range jobId {
		jobIdRule = append(jobIdRule, jobIdItem)
	}
	var freelancerRule []interface{}
	for _, freelancerItem := range freelancer {
		freelancerRule = append(freelancerRule, freelancerItem)
	}

	logs, sub, err := _Escrow.contract.FilterLogs(opts, "JobAssigned", jobIdRule, freelancerRule)
	if err != nil {
		return nil, err
	}
	return &EscrowJobAssignedIterator{contract: _Escrow.contract, event: "JobAssigned", logs: logs, sub: sub}, nil
}

// WatchJobAssigned is a free log subscription operation binding the contract event 0x3738a681a43a0b6a554742a08bae57e0215e8a774217dc2e7de6c9411b6d0ddc.
//
// Solidity: event JobAssigned(uint256 indexed jobId, address indexed freelancer)
func (_Escrow *EscrowFilterer) WatchJobAssigned(opts *bind.WatchOpts, sink chan<- *EscrowJobAssigned, jobId []*big.Int, freelancer []common.Address) (event.Subscription, error) {

	var jobIdRule []interface{}
	for _, jobIdItem := range jobId {
		jobIdRule = append(jobIdRule, jobIdItem)
	}
	var freelancerRule []interface{}
	for _, freelancerItem := range freelancer {
		freelancerRule = append(freelancerRule, freelancerItem)
	}

	logs, sub, err := _Escrow.contract.WatchLogs(opts, "JobAssigned", jobIdRule, freelancerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(EscrowJobAssigned)
				if err := _Escrow.contract.UnpackLog(event, "JobAssigned", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseJobAssigned is a log parse operation binding the contract event 0x3738a681a43a0b6a554742a08bae57e0215e8a774217dc2e7de6c9411b6d0ddc.
//
// Solidity: event JobAssigned(uint256 indexed jobId, address indexed freelancer)
func (_Escrow *EscrowFilterer) ParseJobAssigned(log types.Log) (*EscrowJobAssigned, error) {
	event := new(EscrowJobAssigned)
	if err := _Escrow.contract.UnpackLog(event, "JobAssigned", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// EscrowJobPublishedIterator is returned from FilterJobPublished and is used to iterate over the raw logs and unpacked data for JobPublished events raised by the Escrow contract.
type EscrowJobPublishedIterator struct {
	Event *EscrowJobPublished // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *EscrowJobPublishedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(EscrowJobPublished)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(EscrowJobPublished)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *EscrowJobPublishedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *EscrowJobPublishedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// EscrowJobPublished represents a JobPublished event raised by the Escrow contract.
type EscrowJobPublished struct {
	JobId  *big.Int
	Amount *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterJobPublished is a free log retrieval operation binding the contract event 0x7db35e11922b794d5d5d6d21f8d1e4a0a126472d7447fd4c9e71a3f42ba5b5ca.
//
// Solidity: event JobPublished(uint256 indexed jobId, uint256 amount)
func (_Escrow *EscrowFilterer) FilterJobPublished(opts *bind.FilterOpts, jobId []*big.Int) (*EscrowJobPublishedIterator, error) {

	var jobIdRule []interface{}
	for _, jobIdItem := range jobId {
		jobIdRule = append(jobIdRule, jobIdItem)
	}

	logs, sub, err := _Escrow.contract.FilterLogs(opts, "JobPublished", jobIdRule)
	if err != nil {
		return nil, err
	}
	return &EscrowJobPublishedIterator{contract: _Escrow.contract, event: "JobPublished", logs: logs, sub: sub}, nil
}

// WatchJobPublished is a free log subscription operation binding the contract event 0x7db35e11922b794d5d5d6d21f8d1e4a0a126472d7447fd4c9e71a3f42ba5b5ca.
//
// Solidity: event JobPublished(uint256 indexed jobId, uint256 amount)
func (_Escrow *EscrowFilterer) WatchJobPublished(opts *bind.WatchOpts, sink chan<- *EscrowJobPublished, jobId []*big.Int) (event.Subscription, error) {

	var jobIdRule []interface{}
	for _, jobIdItem := range jobId {
		jobIdRule = append(jobIdRule, jobIdItem)
	}

	logs, sub, err := _Escrow.contract.WatchLogs(opts, "JobPublished", jobIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(EscrowJobPublished)
				if err := _Escrow.contract.UnpackLog(event, "JobPublished", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseJobPublished is a log parse operation binding the contract event 0x7db35e11922b794d5d5d6d21f8d1e4a0a126472d7447fd4c9e71a3f42ba5b5ca.
//
// Solidity: event JobPublished(uint256 indexed jobId, uint256 amount)
func (_Escrow *EscrowFilterer) ParseJobPublished(log types.Log) (*EscrowJobPublished, error) {
	event := new(EscrowJobPublished)
	if err := _Escrow.contract.UnpackLog(event, "JobPublished", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// EscrowWithdrawnIterator is returned from FilterWithdrawn and is used to iterate over the raw logs and unpacked data for Withdrawn events raised by the Escrow contract.
type EscrowWithdrawnIterator struct {
	Event *EscrowWithdrawn // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *EscrowWithdrawnIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(EscrowWithdrawn)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(EscrowWithdrawn)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *EscrowWithdrawnIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *EscrowWithdrawnIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// EscrowWithdrawn represents a Withdrawn event raised by the Escrow contract.
type EscrowWithdrawn struct {
	JobId  *big.Int
	User   common.Address
	Amount *big.Int
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterWithdrawn is a free log retrieval operation binding the contract event 0xcf7d23a3cbe4e8b36ff82fd1b05b1b17373dc7804b4ebbd6e2356716ef202372.
//
// Solidity: event Withdrawn(uint256 indexed jobId, address indexed user, uint256 amount)
func (_Escrow *EscrowFilterer) FilterWithdrawn(opts *bind.FilterOpts, jobId []*big.Int, user []common.Address) (*EscrowWithdrawnIterator, error) {

	var jobIdRule []interface{}
	for _, jobIdItem := range jobId {
		jobIdRule = append(jobIdRule, jobIdItem)
	}
	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _Escrow.contract.FilterLogs(opts, "Withdrawn", jobIdRule, userRule)
	if err != nil {
		return nil, err
	}
	return &EscrowWithdrawnIterator{contract: _Escrow.contract, event: "Withdrawn", logs: logs, sub: sub}, nil
}

// WatchWithdrawn is a free log subscription operation binding the contract event 0xcf7d23a3cbe4e8b36ff82fd1b05b1b17373dc7804b4ebbd6e2356716ef202372.
//
// Solidity: event Withdrawn(uint256 indexed jobId, address indexed user, uint256 amount)
func (_Escrow *EscrowFilterer) WatchWithdrawn(opts *bind.WatchOpts, sink chan<- *EscrowWithdrawn, jobId []*big.Int, user []common.Address) (event.Subscription, error) {

	var jobIdRule []interface{}
	for _, jobIdItem := range jobId {
		jobIdRule = append(jobIdRule, jobIdItem)
	}
	var userRule []interface{}
	for _, userItem := range user {
		userRule = append(userRule, userItem)
	}

	logs, sub, err := _Escrow.contract.WatchLogs(opts, "Withdrawn", jobIdRule, userRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(EscrowWithdrawn)
				if err := _Escrow.contract.UnpackLog(event, "Withdrawn", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseWithdrawn is a log parse operation binding the contract event 0xcf7d23a3cbe4e8b36ff82fd1b05b1b17373dc7804b4ebbd6e2356716ef202372.
//
// Solidity: event Withdrawn(uint256 indexed jobId, address indexed user, uint256 amount)
func (_Escrow *EscrowFilterer) ParseWithdrawn(log types.Log) (*EscrowWithdrawn, error) {
	event := new(EscrowWithdrawn)
	if err := _Escrow.contract.UnpackLog(event, "Withdrawn", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
