<script>
	const props = $props();

	const deposits = props.data.data.depositsData
	const withdraws = props.data.data.withdrawsData

	// let transactions = props.data.data.sort((a, b) => new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf());


	// const depositHeaderNames = ["입출금종류", "화폐", "상태", "입금 시간", "입금 수량", "입금 수수료", "입금 유형"]
	const depositHeaderNames = ["상태", "입금 시간", "입금 수량", "입금 수수료", "입금 유형"]
	// const withdrawHeaderNames = ["입출금종류", "화폐", "상태", "출금 시간", "출금 수량", "출금 수수료", "출금 유형"]
	const withdrawHeaderNames = ["상태", "출금 시간", "출금 수량", "출금 수수료", "출금 유형"]

	// let fromDate = $state("");
	// let toDate = $state("");
	//
	// let selectedAssets = $state([]); // 선택된 자산 값 저장

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
</script>

<div class="flex justify-center flex-col">
	<!-- 입금 -->
	<div class="mt-5 flex justify-center">
		<div
			id="datatable"
			class="w-10/12 bg-base-100 flex flex-col rounded-md shadow --prevent-on-load-init"
		>
			<div class="horizontal-scrollbar overflow-x-auto">
				<div class="inline-block min-w-full align-middle" >
					<div class="overflow-hidden">
						<table class="table table-fixed table-md min-w-full">
							<thead>
								<tr>
									{#each depositHeaderNames as headerName}
										{@render setTableHeaderName(headerName)}
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each deposits as deposit}
									{@render setDepositTableRow(deposit)}
								{/each}
							</tbody>
						</table>
						<span class="mt-5 mb-5 flex justify-center">총 입금액: &nbsp;
									<strong>
										{formatNumber(deposits.reduce((sum, d) => sum + Number(d.amount), 0))} KRW
									</strong>
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="divider"></div>

	<!-- 출금 -->
	<div class="mt-5 flex justify-center">
		<div
			id="datatable"
			class="w-10/12 bg-base-100 flex flex-col rounded-md shadow --prevent-on-load-init"
		>
			<!--		<div class="border-base-content/25 flex items-center border-b px-5 py-3 gap-3">-->

			<!--		</div>-->
			<div class="horizontal-scrollbar overflow-x-auto">
				<div class="inline-block min-w-full align-middle" >
					<div class="overflow-hidden">
						<table class="table table-fixed table-md min-w-full">
							<thead>
							<tr>
								{#each withdrawHeaderNames as headerName}
									{@render setTableHeaderName(headerName)}
								{/each}
							</tr>
							</thead>
							<tbody>
							{#each withdraws as withdraw}
								{@render setWithdrawTableRow(withdraw)}
							{/each}
							</tbody>
						</table>
						<span class="mt-5 mb-5 flex justify-center">총 출금액: &nbsp;
							<strong>
								{formatNumber(withdraws.reduce((sum, w) => sum + Number(w.amount + w.fee), 0))} KRW
							</strong>
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="divider"></div>

	<!-- 총계 -->
	<div class="flex justify-center">
		<span class="mt-5">
			차액(입금 - 출금): &nbsp;
			<strong>
				{
					formatNumber(
						deposits.reduce((sum, d) => sum + Number(d.amount), 0)
						- withdraws.reduce((sum, w) => sum + Number(w.amount + w.fee), 0))
				} KRW
			</strong>
		</span>
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

{#snippet setDepositTableRow(deposit)}
	<tr>
<!--		<td>{deposit.type}</td>-->
<!--		<td>{deposit.currency}</td>-->
		<td>{deposit.state}</td>
		<td>{formatDate(deposit.done_at)}</td>
<!--		<td>{formatNumber(deposit.amount)}</td>-->
		<td>{formatNumber(Number(deposit.amount))}</td>
		<td>{deposit.fee}</td>
		<td>{deposit.transaction_type}</td>
	</tr>
{/snippet}

{#snippet setWithdrawTableRow(withdraw)}
	<tr>
		<!--		<td>{deposit.type}</td>-->
		<!--		<td>{deposit.currency}</td>-->
		<td>{withdraw.state}</td>
		<td>{formatDate(withdraw.done_at)}</td>
		<!--		<td>{formatNumber(deposit.amount)}</td>-->
		<td>{formatNumber(Number(withdraw.amount))}</td>
		<td>{withdraw.fee}</td>
		<td>{withdraw.transaction_type}</td>
	</tr>
{/snippet}
