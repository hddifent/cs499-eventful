<script module lang="ts">
	import MdiEmail from 'virtual:icons/mdi/email';
	import MdiUser from 'virtual:icons/mdi/account';
	import MdiUserDisp from 'virtual:icons/mdi/account-arrow-right';
	import MdiLock from 'virtual:icons/mdi/lock';
	import MdiLockCheck from 'virtual:icons/mdi/lock-check';

	import MdiOrgUnique from 'virtual:icons/mdi/account-group';
	import MdiOrgDisp from 'virtual:icons/mdi/account-group-outline';

	export {
		emailLabel,
		usernameLabel,
		displayNameLabel,
		passwordLabel,
		confirmPasswordLabel,
		orgUniqueNameLabel,
		orgDisplayNameLabel
	};
</script>

{#snippet emailLabel()}
	<MdiEmail /> Email
{/snippet}

{#snippet usernameLabel()}
	<MdiUser /> Username
{/snippet}

{#snippet displayNameLabel()}
	<MdiUserDisp /> Display Name
{/snippet}

{#snippet passwordLabel()}
	<MdiLock /> Password
{/snippet}

{#snippet confirmPasswordLabel()}
	<MdiLockCheck /> Confirm Password
{/snippet}

{#snippet orgUniqueNameLabel()}
	<MdiOrgUnique /> Group Unique Name
{/snippet}

{#snippet orgDisplayNameLabel()}
	<MdiOrgDisp /> Group Display Name
{/snippet}
