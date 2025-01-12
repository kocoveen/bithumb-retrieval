<script>
	// import { onMount } from 'svelte';
	const props = $props();
	let orders = props.data.data.sort((a, b) => new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf());

	const headerNames = ["거래일시", "자산", "거래구분", "거래수량", "체결가격", "거래금액", "수수료", "정산금액"]

	// let options = {
	// 	"pageLength": 5,
	// 	"pagingOptions": {
	// 		"pageBtnClasses": "btn btn-text btn-circle btn-sm"
	// 	},
	// 	"selecting": true,
	// 	"rowSelectingOptions": {
	// 		"selectAllSelector": "#datatable-filter-select-all-rows",
	// 		"individualSelector": ".datatable-filter-select-row"
	// 	},
	// 	"language": {
	// 		"zeroRecords": "<div class=\"py-10 px-5 flex flex-col justify-center items-center text-center\"><span class=\"icon-[tabler--search] shrink-0 size-6 text-base-content\"></span><div class=\"max-w-sm mx-auto\"><p class=\"mt-2 text-sm text-base-content/80\">No search results</p></div></div>"
	// 	}
	// };

	// let sideOptions = {
	// 	"placeholder": "Select option...",
	// 	"toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
	// 	"toggleClasses": "advance-select-toggle advance-select-sm max-sm:w-20 w-36",
	// 	"dropdownClasses": "advance-select-menu max-sm:w-28 w-full",
	// 	"optionClasses": "advance-select-option selected:active",
	// 	"optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"icon-[tabler--check] flex-shrink-0 size-3 text-primary hidden selected:block \"></span></div>",
	// 	"extraMarkup": "<span class=\"icon-[tabler--caret-up-down] flex-shrink-0 size-4 text-base-content absolute top-1/2 end-2 -translate-y-1/2 \"></span>"
	// }
	//
	// let pageEntriesOptions = {
	// 	"placeholder": "Select option...",
	// 	"toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
	// 	"toggleClasses": "advance-select-toggle advance-select-sm",
	// 	"dropdownClasses": "advance-select-menu w-24 max-sm:w-16",
	// 	"optionClasses": "advance-select-option selected:active",
	// 	"optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"icon-[tabler--check] flex-shrink-0 size-3 text-primary hidden selected:block \"></span></div>",
	// 	"extraMarkup": "<span class=\"icon-[tabler--caret-up-down] flex-shrink-0 size-4 text-base-content absolute top-1/2 end-2 -translate-y-1/2 \"></span>"
	// };

	let filteredOrders = $state([...orders]); // 필터링된 데이터 저장
	let fromDate = $state("");
	let toDate = $state("");

	let selectedAssets = $state([]); // 선택된 자산 값 저장
	// 날짜 필터링 함수
	function filterByDate() {
		if (fromDate && toDate) {
			filteredOrders = orders.filter((order) => {
				const createdAt = new Date(order.created_at).getTime();
				const from = new Date(fromDate).getTime();
				const to = new Date(toDate).getTime();
				return createdAt >= from && createdAt <= to;
			});
		} else {
			filteredOrders = [...orders]; // 초기화
		}
	}

	// 자산 필터링 함수
	// function filterByAssets() {
	// 	if (selectedAssets.length > 0) {
	// 		filteredOrders = orders.filter((order) =>
	// 			selectedAssets.includes(order.market)
	// 		);
	// 	} else {
	// 		filteredOrders = [...orders]; // 초기화
	// 	}
	// }


	// 날짜와 자산 필터를 결합
	function applyAllFilters() {
		filteredOrders = orders.filter((order) => {
			const createdAt = new Date(order.created_at).getTime();
			const from = fromDate ? new Date(fromDate).getTime() : 0;
			const to = toDate ? new Date(toDate).getTime() : Infinity;
			const matchesDate = createdAt >= from && createdAt <= to;

			const matchesAssets =
				selectedAssets.length > 0
					? selectedAssets.includes(order.market)
					: true;

			return matchesDate && matchesAssets;
		});
	}

	function getTotalValue() {
		return filteredOrders.map(o => o.volume * o.price).reduce(function(x, y) {
			return x + y;
		}, 0);
	}

	function getTotalSettlement() {
		return filteredOrders.map(o => o.side === 'bid' ? -(o.volume * o.price - o.paid_fee) : (o.volume * o.price - o.paid_fee)).reduce((x, y) => {
			return x + y;
		}, 0);
	}

	// 날짜 포맷팅 함수
	function formatDate(dateString) {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const seconds = String(date.getSeconds()).padStart(2, "0");

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}

	function formatNumber(number) {
		return number.toLocaleString('en-US'); // 세 자리마다 쉼표 추가
	}


	let dataAssetsOptions = {
		"placeholder": "코인 선택",
		"toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
		"toggleClasses": "advance-select-toggle",
		"toggleSeparators": {
			"betweenItemsAndCounter": "&"
		},
		"hasSearch": true,
		"toggleCountText": "+",
		"toggleCountTextPlacement": "prefix-no-space",
		"toggleCountTextMinItems": 3,
		"toggleCountTextMode": "nItemsAndCount",
		"dropdownClasses": "advance-select-menu max-h-60 vertical-scrollbar rounded-scrollbar",
		"optionClasses": "advance-select-option selected:active",
		"optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"icon-[tabler--check] flex-shrink-0 size-4 text-primary hidden selected:block \"></span></div>",
		"extraMarkup": "<span class=\"icon-[tabler--caret-up-down] flex-shrink-0 size-4 text-base-content absolute top-1/2 end-3 -translate-y-1/2 \"></span>"
	};

	// 상태 변화에 따른 부작용 처리
	// $effect(() => {
	// 	window.addEventListener('load', () =>
	// 		requestAnimationFrame(() => {
	// 			(() => {
	// 				const clearBtn = document.querySelector('#clear-btn')
	//
	// 				clearBtn.addEventListener('click', () => {
	// 					const clearSelectBtn = HSSelect.getInstance('#multi-cond-count', true)
	//
	// 					clearSelectBtn.element.setValue([])
	// 				})
	// 			})()
	// 		})
	// 	)}
	// );
</script>

<!--<div-->
<!--	id="datatable"-->
<!--	class="bg-base-100 flex flex-col rounded-md shadow &#45;&#45;prevent-on-load-init"-->
<!--	data-datatable="{JSON.stringify(options)}"-->
<!--&gt;-->
<div class="flex justify-center">
<div
	id="datatable"
	class="w-10/12 bg-base-100 flex flex-col rounded-md shadow --prevent-on-load-init"
>
	<div class="border-base-content/25 flex items-center border-b px-5 py-3 gap-3">
<!--		<div class="input-group max-w-[15rem]">-->
<!--      <span class="input-group-text">-->
<!--        <span class="icon-[tabler&#45;&#45;search] text-base-content size-4 shrink-0"></span>-->
<!--      </span>-->
<!--			<label class="sr-only" for="filter-search"></label>-->
<!--			<input type="search" class="input input-sm grow" id="filter-search" placeholder="Search for items" data-datatable-search="" />-->
<!--		</div>-->

		<div class="flex gap-3">
			<!-- 날짜 입력 -->
			<div class="flex flex-wrap items-center justify-end">
				<input
					type="date"
					id="fromDate"
					class="input input-floating peer"
					bind:value={fromDate}
					onchange={filterByDate}
				/>
			</div>
			<div class="flex flex-wrap items-center justify-end"> ~ </div>
			<div class="flex flex-wrap items-center justify-end">
				<input
					type="date"
					id="toDate"
					class="input input-floating peer"
					bind:value={toDate}
					onchange={filterByDate}
				/>
			</div>
		</div>

		<div class="w-1/4">
			<select
				id="multi-cond-count"
				multiple=""
				bind:value={selectedAssets}
				onchange={applyAllFilters}
				data-select='{JSON.stringify(dataAssetsOptions)}'
				class="hidden"
			>
				<option value="">Choose</option>
				{#each [...new Set(orders.map((order) => order.market))] as market}
					<option value={market}>{market}</option>
				{/each}
			</select>
		</div>

		<div class="flex flex-wrap gap-2">
			<button type="button" id="clear-btn" class="btn btn-outline btn-primary btn-sm" onclick={() => {
				const clearSelectBtn = HSSelect.getInstance('#multi-cond-count', true)
				clearSelectBtn.element.setValue([])
				selectedAssets = [];
				applyAllFilters();
  		}}>코인 재설정</button>
		</div>

		<div class="flex flex-1 justify-end gap-3">
			<div class="w-full max-w-md shadow-md rounded-lg overflow-hidden">
				<div class="divide-y divide-gray-200">
					<div class="px-4 py-5 sm:p-6 grid grid-cols-2 gap-4">
						<div class="text font-medium">거래금액 합계</div>
						<div class="text text-right font-bold" id="totalVolume">{formatNumber(getTotalValue())} KRW</div>
					</div>
					<div class="px-4 py-5 sm:p-6 grid grid-cols-2 gap-4">
						<div class="text font-medium">정산금액 합계</div>
						<div class="text text-right font-bold" id="totalSettlement">{formatNumber(getTotalSettlement())} KRW</div>
					</div>
				</div>
			</div>
		</div>

<!--		<div class="flex flex-1 items-center justify-end gap-3">-->
<!--			&lt;!&ndash; Select &ndash;&gt;-->
<!--			<select-->
<!--				data-select="{JSON.stringify(pageEntriesOptions)}"-->
<!--				data-datatable-page-entities=""-->
<!--				class="hidden">-->
<!--				<option value="500" selected="">500</option>-->
<!--				<option value="100">100</option>-->
<!--				<option value="50">50</option>-->
<!--				<option value="40">40</option>-->
<!--				<option value="30">30</option>-->
<!--				<option value="20">20</option>-->
<!--				<option value="10">10</option>-->
<!--			</select>-->
<!--			&lt;!&ndash; End Select &ndash;&gt;-->
<!--			<select-->
<!--				data-select="{JSON.stringify(sideOptions)}"-->
<!--				class="hidden"-->
<!--				id="select-stock">-->
<!--				<option value="all">All</option>-->
<!--				<option value="In Stock">In Stock</option>-->
<!--				<option value="Out of Stock">Out of Stock</option>-->
<!--				<option value="Limited">Limited</option>-->
<!--			</select>-->
<!--		</div>-->
	</div>
	<div class="horizontal-scrollbar overflow-x-auto">
		<div class="inline-block min-w-full align-middle" >
			<div class="overflow-hidden">
				<table class="table table-fixed table-md min-w-full">
					<thead>
						<tr>
	<!--						<th scope="col" class="&#45;&#45;exclude-from-ordering w-3.5 pe-0">-->
	<!--							<div class="flex h-5 items-center">-->
	<!--								<input id="datatable-filter-select-all-rows" type="checkbox" class="checkbox checkbox-sm" />-->
	<!--								<label for="datatable-filter-select-all-rows" class="sr-only">Checkbox</label>-->
	<!--							</div>-->
	<!--						</th>-->
							{#each headerNames as headerName}
								{@render setTableHeaderName(headerName)}
							{/each}
	<!--						<th scope="col" class="&#45;&#45;exclude-from-ordering">Actions</th>-->
						</tr>
					</thead>
					<tbody>
						{#each filteredOrders as order}
							{@render setTableRow(order)}
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

<!--	<div class="border-base-content/25 flex items-center justify-between gap-3 border-t p-3 max-md:flex-wrap max-md:justify-center">-->
<!--		<div class="text-base-content/80 text-sm" data-datatable-info="">-->
<!--			Showing-->
<!--			<span data-datatable-info-from="1"></span>-->
<!--			to-->
<!--			<span data-datatable-info-to="30"></span>-->
<!--			of-->
<!--			<span data-datatable-info-length="50"></span>-->
<!--			products-->
<!--		</div>-->
<!--		<div class="flex hidden items-center space-x-1" data-datatable-paging="">-->
<!--			<button type="button" class="btn btn-text btn-circle btn-sm" data-datatable-paging-prev="">-->
<!--				<span aria-hidden="true">«</span>-->
<!--				<span class="sr-only">Previous</span>-->
<!--			</button>-->
<!--			<div class="[&>.active]:text-bg-soft-primary flex items-center space-x-1" data-datatable-paging-pages=""></div>-->
<!--			<button type="button" class="btn btn-text btn-circle btn-sm" data-datatable-paging-next="">-->
<!--				<span class="sr-only">Next</span>-->
<!--				<span aria-hidden="true">»</span>-->
<!--			</button>-->
<!--		</div>-->
<!--	</div>-->
</div>
</div>

{#snippet setTableHeaderName(name)}
	<th scope="col" class="">
		<div class="flex items-center justify-between font-bold">
			{name}
			<span class="icon-[tabler--chevron-up] datatable-ordering-asc:block hidden"></span>
			<span class="icon-[tabler--chevron-down] datatable-ordering-desc:block hidden"></span>
		</div>
	</th>
{/snippet}

{#snippet setTableRow(order)}
	<tr>
<!--		<td class="w-3.5 pe-0">-->
<!--			<div class="flex h-5 items-center">-->
<!--				<input id="table-filter-1" type="checkbox" class="checkbox checkbox-sm datatable-filter-select-row" data-datatable-row-selecting-individual="" />-->
<!--				<label for="table-filter-1" class="sr-only">Checkbox</label>-->
<!--			</div>-->
<!--		</td>-->
<!--		<td class="text-nowrap">{createdAt}</td>-->
		<td>{formatDate(order.created_at)}</td>
		<td>{order.market}</td>
		<td>
			{#if order.state === 'done'}
				<span class="badge badge-soft badge-success badge-sm">{order.state}</span>
			{:else if order.state === "wait"}
				<span class="badge badge-soft badge-warning badge-sm">{order.state}</span>
			{:else if order.state === "cancel"}
				<span class="badge badge-soft badge-error badge-sm">{order.state}</span>
			{/if}
		</td>
		<td>{formatNumber(order.volume)}</td>
		<td>{formatNumber(order.price)}</td>
		<td>{formatNumber(order.volume * order.price)}</td> <!-- 거래 금액 -->
		<td>{formatNumber(order.paid_fee)}</td> <!-- 수수료 -->
		{#if order.side === 'bid'}
			<td class="text-blue-400 font-bold">
				-{formatNumber(order.volume * order.price - order.paid_fee)}
			</td>
		{:else}
			<td class="text-red-400 font-bold">
				+{formatNumber(order.volume * order.price - order.paid_fee)}
			</td>
		{/if} <!-- 정산 금액 -->

<!--		<td><span class="badge badge-soft badge-success badge-sm">In Stock</span></td>-->
<!--		<td>-->
<!--			<button class="btn btn-circle btn-text btn-sm" aria-label="Action button">-->
<!--				<span class="icon-[tabler&#45;&#45;pencil] size-5"></span>-->
<!--			</button>-->
<!--			<button class="btn btn-circle btn-text btn-sm" aria-label="Action button">-->
<!--				<span class="icon-[tabler&#45;&#45;trash] size-5"></span>-->
<!--			</button>-->
<!--			<button class="btn btn-circle btn-text btn-sm" aria-label="Action button">-->
<!--				<span class="icon-[tabler&#45;&#45;dots-vertical] size-5"></span>-->
<!--			</button>-->
<!--		</td>-->
	</tr>
{/snippet}
