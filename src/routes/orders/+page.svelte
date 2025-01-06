<script>
	// import * as j$ from 'jquery';
	// import { onMount } from 'svelte';
	const props = $props();
	const orders = props.data.data;

	const headerNames = ["거래일시", "자산", "거래구분", "거래수량", "체결가격", "거래금액", "수수료", "정산금액"];

	let options = {
		"pageLength": 5,
		"pagingOptions": {
			"pageBtnClasses": "btn btn-text btn-circle btn-sm"
		},
		"selecting": true,
		"rowSelectingOptions": {
			"selectAllSelector": "#datatable-filter-select-all-rows",
			"individualSelector": ".datatable-filter-select-row"
		},
		"language": {
			"zeroRecords": "<div class=\"py-10 px-5 flex flex-col justify-center items-center text-center\"><span class=\"icon-[tabler--search] shrink-0 size-6 text-base-content\"></span><div class=\"max-w-sm mx-auto\"><p class=\"mt-2 text-sm text-base-content/80\">No search results</p></div></div>"
		}
	};

	let sideOptions = {
		"placeholder": "Select option...",
		"toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
		"toggleClasses": "advance-select-toggle advance-select-sm max-sm:w-20 w-36",
		"dropdownClasses": "advance-select-menu max-sm:w-28 w-full",
		"optionClasses": "advance-select-option selected:active",
		"optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"icon-[tabler--check] flex-shrink-0 size-3 text-primary hidden selected:block \"></span></div>",
		"extraMarkup": "<span class=\"icon-[tabler--caret-up-down] flex-shrink-0 size-4 text-base-content absolute top-1/2 end-2 -translate-y-1/2 \"></span>"
	}

	let pageEntriesOptions = {
		"placeholder": "Select option...",
		"toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
		"toggleClasses": "advance-select-toggle advance-select-sm",
		"dropdownClasses": "advance-select-menu w-24 max-sm:w-16",
		"optionClasses": "advance-select-option selected:active",
		"optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"icon-[tabler--check] flex-shrink-0 size-3 text-primary hidden selected:block \"></span></div>",
		"extraMarkup": "<span class=\"icon-[tabler--caret-up-down] flex-shrink-0 size-4 text-base-content absolute top-1/2 end-2 -translate-y-1/2 \"></span>"
	};

	$effect(() => {
		const { dataTable } = new HSDataTable('#datatable');
	})
</script>

<div
	id="datatable"
	class="bg-base-100 flex flex-col rounded-md shadow --prevent-on-load-init"
	data-datatable="{JSON.stringify(options)}"
>
	<div class="border-base-content/25 flex items-center border-b px-5 py-3 gap-3">
		<div class="input-group max-w-[15rem]">
      <span class="input-group-text">
        <span class="icon-[tabler--search] text-base-content size-4 shrink-0"></span>
      </span>
			<label class="sr-only" for="filter-search"></label>
			<input type="search" class="input input-sm grow" id="filter-search" placeholder="Search for items" data-datatable-search="" />
		</div>
		<div class="flex flex-1 items-center justify-end gap-3">
			<!-- Select -->
			<select
				data-select="{JSON.stringify(pageEntriesOptions)}"
				data-datatable-page-entities=""
				class="hidden">
				<option value="5" selected="">5</option>
				<option value="10">10</option>
				<option value="20">20</option>
				<option value="30">30</option>
				<option value="40">40</option>
				<option value="50">50</option>
			</select>
			<!-- End Select -->
			<select
				data-select="{JSON.stringify(sideOptions)}"
				class="hidden"
				id="select-stock">
				<option value="all">All</option>
				<option value="In Stock">In Stock</option>
				<option value="Out of Stock">Out of Stock</option>
				<option value="Limited">Limited</option>
			</select>
		</div>
	</div>
	<div class="horizontal-scrollbar overflow-x-auto">
		<div class="inline-block min-w-full align-middle" >
			<div class="overflow-hidden">
				<table class="table min-w-full">
					<thead>
					<tr>
						<th scope="col" class="--exclude-from-ordering w-3.5 pe-0">
							<div class="flex h-5 items-center">
								<input id="datatable-filter-select-all-rows" type="checkbox" class="checkbox checkbox-sm" />
								<label for="datatable-filter-select-all-rows" class="sr-only">Checkbox</label>
							</div>
						</th>
						{#each headerNames as headerName}
							{@render setTableHeaderName(headerName)}
						{/each}
						<th scope="col" class="--exclude-from-ordering">Actions</th>
					</tr>
					</thead>
					<tbody>
						{#each orders as order}
							{@render setTableRow(order)}
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<div class="border-base-content/25 flex items-center justify-between gap-3 border-t p-3 max-md:flex-wrap max-md:justify-center">
		<div class="text-base-content/80 text-sm" data-datatable-info="">
			Showing
			<span data-datatable-info-from="1"></span>
			to
			<span data-datatable-info-to="30"></span>
			of
			<span data-datatable-info-length="50"></span>
			products
		</div>
		<div class="flex hidden items-center space-x-1" data-datatable-paging="">
			<button type="button" class="btn btn-text btn-circle btn-sm" data-datatable-paging-prev="">
				<span aria-hidden="true">«</span>
				<span class="sr-only">Previous</span>
			</button>
			<div class="[&>.active]:text-bg-soft-primary flex items-center space-x-1" data-datatable-paging-pages=""></div>
			<button type="button" class="btn btn-text btn-circle btn-sm" data-datatable-paging-next="">
				<span class="sr-only">Next</span>
				<span aria-hidden="true">»</span>
			</button>
		</div>
	</div>
</div>

<div>
	<p>거래금액 합계: <span id="totalVolume"></span></p>
	<p>정산금액 합계 (매도 - 매수): <span id="totalSettlement"></span> KRW</p>
</div>


{#snippet setTableHeaderName(name)}
	<th scope="col" class="group w-fit">
		<div class="flex items-center justify-between">
			{name}
			<span class="icon-[tabler--chevron-up] datatable-ordering-asc:block hidden"></span>
			<span class="icon-[tabler--chevron-down] datatable-ordering-desc:block hidden"></span>
		</div>
	</th>
{/snippet}

{#snippet setTableRow(order)}
	<tr>
		<td class="w-3.5 pe-0">
			<div class="flex h-5 items-center">
				<input id="table-filter-1" type="checkbox" class="checkbox checkbox-sm datatable-filter-select-row" data-datatable-row-selecting-individual="" />
				<label for="table-filter-1" class="sr-only">Checkbox</label>
			</div>
		</td>
<!--		<td class="text-nowrap">{createdAt}</td>-->
		<td>{order.created_at}</td>
		<td>{order.market}</td>
		<td>{order.state}</td>
		<td>{order.volume}</td>
		<td>{order.price}</td>
		<td>{order.volume * order.price}</td> <!-- value -->
		<td>{order.paid_fee}</td>

		{#if order.side === 'bid'}
			<td>-{order.volume * order.price - order.paid_fee}</td>
		{:else}
			<td>{order.volume * order.price - order.paid_fee}</td>
		{/if}<!-- settlement_amount -->
<!--		<td><span class="badge badge-soft badge-success badge-sm">In Stock</span></td>-->
		<td>
			<button class="btn btn-circle btn-text btn-sm" aria-label="Action button">
				<span class="icon-[tabler--pencil] size-5"></span>
			</button>
			<button class="btn btn-circle btn-text btn-sm" aria-label="Action button">
				<span class="icon-[tabler--trash] size-5"></span>
			</button>
			<button class="btn btn-circle btn-text btn-sm" aria-label="Action button">
				<span class="icon-[tabler--dots-vertical] size-5"></span>
			</button>
		</td>
	</tr>
{/snippet}
