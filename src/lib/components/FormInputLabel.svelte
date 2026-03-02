<script module lang="ts">
	import MdiEmail from 'virtual:icons/mdi/email';
	import MdiUser from 'virtual:icons/mdi/account';
	import MdiUserDisp from 'virtual:icons/mdi/account-arrow-right';
	import MdiLock from 'virtual:icons/mdi/lock';
	import MdiLockCheck from 'virtual:icons/mdi/lock-check';

	export { emailLabel, usernameLabel, displayNameLabel, passwordLabel, confirmPasswordLabel };
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
